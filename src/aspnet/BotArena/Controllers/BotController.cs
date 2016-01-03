using System;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Infrastructure.Authorization;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class BotController : BaseController
    {
        private Bot GetBotWithUser(int id)
        {
            return Repository
                .Find<Bot>().Where(x => x.Id == id)
                .Join(x => x.User)
                .Execute();
        }

        private bool IsBotOwnedByCurrentUser(Bot bot)
        {
            var currentUserId = GetCurrentUserId();
            return bot.User != null && bot.UserId == currentUserId;
        }

        public ActionResult Create()
        {
            return View(new Bot());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Bot bot)
        {
            var existingBot = Repository
                .Find<Bot>()
                .Where(x => x.Name == bot.Name)
                .Select(x => x.Name)
                .Execute();

            if (existingBot != null)
            {
                ModelState.AddModelError("", "The is already a bot with the given name");
                return View(bot);
            }

            var userId = GetCurrentUserId();
            var defaultScript = System.IO.File.ReadAllText(Server.MapPath("~/Scripts/bots/bootstrapping/defaultBotScript.js"));

            bot.UserId = userId;
            bot.Script = defaultScript;

            Repository.Insert(bot);

            return RedirectToAction("Edit", "Bot", new { id = bot.Id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id)
        {
            var bot = GetBotWithUser(id);

            if (bot == null)
                return new HttpNotFoundResult();
            if (!IsBotOwnedByCurrentUser(bot))
                return new HttpUnauthorizedResult();

            Repository.Delete(bot);

            return RedirectToAction("MyProfile", "User");
        }

        [Admin]
        public ActionResult CreateFromFiles()
        {
            using (var transaction = Repository.BeginTransaction())
            {
                var fileBotRepository = new FileBotRepository(Server.MapPath("~/Scripts/bots/"));
                var fileBots = fileBotRepository.GetAll();
                var fileBotNames = fileBots.Select(x => x.Name).ToArray();

                var existingFileBots = Repository
                    .Find<Bot>()
                    .Where(x => fileBotNames.Contains(x.Name))
                    .ExecuteList();

                var gosuArenaTrainer = Repository
                    .Find<User>()
                    .Where(x => x.Username == "GosuArenaTrainer")
                    .Execute();

                if (gosuArenaTrainer == null)
                    throw new InvalidOperationException("The GosuArenaTrainer user has not been created");

                foreach (var fileBot in fileBots)
                {
                    var existingBot = existingFileBots.SingleOrDefault(x => x.Name == fileBot.Name);

                    if (existingBot != null)
                    {
                        existingBot.Script = fileBot.Script;
                        existingBot.IsDemoBot = fileBot.IsDemoBot;
                        Repository.Update(existingBot);
                    }
                    else
                    {
                        fileBot.UserId = gosuArenaTrainer.Id;
                        Repository.Insert(fileBot);
                    }
                }

                transaction.Commit();
            }

            return RedirectToAction("Profile", "User", new { username = "GosuArenaTrainer" });
        }
    }
}