using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Management;
using GosuArena.Entities;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public class BotApiController : ApiController
    {
        private const string AuthSchemeName = "GosuArenaApiKey";

        readonly Repository _repository;

        public BotApiController() : this(new Repository()) { }

        public BotApiController(Repository repository)
        {
            _repository = repository;
        }

        /* 
            Example request:
         
            GET http://localhost:62541/api/bot/32 HTTP/1.1
            Host: localhost:62541
            Authorization: GosuArenaApiKey 12345
         
         */
        public string Get(int id)
        {
            var bot = GetBotWithUser(id);

            ValidateRequest(bot);

            return bot.Script;
        }

        public void Put(int id)
        {
            var bot = GetBotWithUser(id);

            ValidateRequest(bot);

            bot.Script = Request.Content.ReadAsStringAsync().Result;

            _repository.Update(bot);
        }

        private void ValidateRequest(Bot bot)
        {
            if (bot == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

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
    }
}