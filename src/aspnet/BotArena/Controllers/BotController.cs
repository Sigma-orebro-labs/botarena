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