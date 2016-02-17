using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using GosuArena.Entities;
using GosuArena.Extensions;
using GosuArena.Models.Match;
using WeenyMapper;

namespace GosuArena.Controllers.Api
{
    public class BotsController : ApiController
    {
        private const string AuthSchemeName = "GosuArenaApiKey";

        readonly Repository _repository;

        public BotsController() : this(new Repository()) { }

        public BotsController(Repository repository)
        {   
            _repository = repository;
        }

        /* 
            Example request:
         
            GET http://localhost:62541/api/bot/32 HTTP/1.1
            Host: localhost:62541
            Authorization: GosuArenaApiKey 12345
         
         */
        public ApiBotModel Get(int id)
        {
            var bot = GetBotWithUser(id);

            ValidateRequest(bot);

            return new ApiBotModel(bot);
        }

        public IEnumerable<ApiBotModel> Get([FromUri]bool includeScript = false, [FromUri]bool currentUser = false)
        {
            var query = _repository.Find<Bot>()
                .Where(x => !x.IsDemoBot)
                .Join(x => x.User);

            if (currentUser && !User.Identity.IsAuthenticated)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot show bots for current user without an active auth session"));
            }

            if (currentUser)
            {
                var userId = _repository
                    .Find<User>()
                    .Select(x => x.Id)
                    .Where(x => x.Username == User.Identity.Name)
                    .ExecuteScalar<int>();

                query = query.AndWhere(x => x.UserId == userId && !x.IsTrainer);
            }
            else
            {
                query.AndWhere(x => x.IsPublic);
            }

            var bots = query
                .OrderBy(x => x.Name)
                .ExecuteList();

            return CreateModels(bots, includeScript);
        }

        [Route("api/bots/{botId}/trainingbots")]
        public IEnumerable<ApiBotModel> GetTrainingBots(int botId, [FromUri] bool includeScript = false)
        {
            if (!User.Identity.IsAuthenticated)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Not logged in"));
            }

            var userId = _repository.GetUserId(User.Identity.Name);

            var botAuthorId = _repository
                .Find<Bot>()
                .Select(x => x.UserId)
                .Where(x => x.Id == botId)
                .ExecuteScalar<int>();

            if (userId != botAuthorId)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "You do not own the requested bot"));
            }

            var trainingBots = _repository.Find<Bot>()
                .Where(x => !x.IsDemoBot && (x.IsTrainer || x.UserId == userId))
                .Join(x => x.User)
                .OrderBy(x => x.Name)
                .ExecuteList();

            return CreateModels(trainingBots, includeScript);
        }

        public void Put(ApiBotModel postedBot)
        {
            var bot = GetBotWithUser(postedBot.Id);

            ValidateRequest(bot);

            bot.Script = postedBot.Script;
            bot.IsPublic = postedBot.IsPublic;

            _repository.Update(bot);
        }

        [Authorize]
        public HttpResponseMessage Post(ApiBotCreateModel model)
        {
            if (model == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Data was not recieved in the expected format");
            }

            var existingBotCount = _repository
                   .Count<Bot>()
                   .Where(x => x.Name == model.Name)
                   .Execute();

            if (existingBotCount > 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, "The specified bot name is already in use");
            }

            if (!model.ColorHexCode.IsValidHexColorCode())
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid color code");
            }

            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid bot name");
            }

            var augmentationStartSnippet = "";

            foreach (string augmentation in model.Powerups)
            {
                try
                {
                    augmentationStartSnippet += System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Scripts/bots/bootstrapping/augmentations/"+ augmentation + "Snippet.js"));
                }
                catch (Exception)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Equipment code snippet error.");
                }
            }

            var userId = _repository.GetUserId(User.Identity.Name);
            var defaultScript = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath("~/Scripts/bots/bootstrapping/defaultBotScriptTemplate.js"))
                .Replace("%COLOR_HEX_CODE%", model.ColorHexCode)
                .Replace("%BOT_CLASS%", model.ClassName)
                .Replace("%EQUIPMENT%", string.Join(", ", model.Equipment.Select(AddQuotes)))
                .Replace("%AUGMENTATIONS%", string.Join(", ", model.Powerups.Select(AddQuotes)))
                .Replace("%AUGMENTATION_SNIPPET%", augmentationStartSnippet);

            var bot = new Bot
            {
                Name = model.Name,
                Script = defaultScript,
                UserId = userId
            };

            _repository.Insert(bot);

            return Request.CreateResponse(HttpStatusCode.Created, new ApiBotModel(bot));
        }

        private string AddQuotes(string arg)
        {
            return $"'{arg}'";
        }

        private void ValidateRequest(Bot bot)
        {
            if (bot == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            if (User.Identity.IsAuthenticated)
            {
                ValidateAuthenticatedCall(bot);
            }
            else
            {
                ValidateExternalApiCall(bot);
            }
        }

        private void ValidateAuthenticatedCall(Bot bot)
        {
            if (!bot.IsUserAuthorized(User.Identity.Name))
            {
                ThrowUnauthorizedException();
            }
        }

        private void ValidateExternalApiCall(Bot bot)
        {
            IncrementApiCallCount(bot.User);

            if (Request.Headers.Authorization == null)
                ThrowUnauthorizedException();

            var scheme = Request.Headers.Authorization.Scheme;
            var apiKey = Request.Headers.Authorization.Parameter;

            var isApiKeyScheme = scheme.ToLower() == AuthSchemeName.ToLower();

            if (!isApiKeyScheme || !bot.IsAuthorized(apiKey))
            {
                ThrowUnauthorizedException();
            }
        }

        private void IncrementApiCallCount(User user)
        {
            _repository.Update<User>()
                .Set(x => x.ApiRequestCount, user.ApiRequestCount + 1)
                .Where(x => x.Id == user.Id)
                .Execute();
        }

        private void ThrowUnauthorizedException()
        {
            var response = Request.CreateResponse(HttpStatusCode.Unauthorized);

            response.Headers.Add("WWW-Authenticate", string.Format("{0} realm=\"api\"", AuthSchemeName));

            throw new HttpResponseException(response);
        }

        private Bot GetBotWithUser(int id)
        {
            return _repository.Find<Bot>()
                .Where(x => x.Id == id)
                .Join(x => x.User)
                .Execute();
        }

        private static List<ApiBotModel> CreateModels(IEnumerable<Bot> bots, bool includeScript)
        {
            var botModels = bots.Select(x => new ApiBotModel(x)).ToList();

            if (includeScript != true)
            {
                foreach (var botModel in botModels)
                {
                    botModel.Script = null;
                }
            }

            return botModels;
        }
    }
}