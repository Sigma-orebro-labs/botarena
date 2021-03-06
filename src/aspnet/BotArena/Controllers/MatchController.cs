﻿using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Extensions;
using GosuArena.Models.Match;
using WeenyMapper.Extensions;

namespace GosuArena.Controllers
{
    public class MatchController : BaseController
    {
        public ActionResult Index()
        {
            var bots = Repository.Find<Bot>()
                .Where(x => x.IsTrainer && !x.IsDemoBot)
                .Join<User, Bot>(x => x.Bots, x => x.User)
                .ExecuteList();

            return PlayMatch(bots);
        }

        [Authorize]
        public ActionResult Play(IList<string> rosters, bool isTeam = false)
        {
            if (rosters == null || rosters.IsEmpty())
                return InvalidBotSetupError();

            if (!isTeam)
                return PlayFFA(rosters[0]);

            var botNames = rosters.SelectMany(GetBotNames).ToList();

            var bots = GetBots(botNames);

            if (IsBotSetupInvalid(bots))
                return InvalidBotSetupError();

            var botModels = CreateBotModels(rosters, bots);

            return PlayMatch(botModels);
        }

        [Authorize]
        public ActionResult PlayFFA(string names)
        {
            var botsInMatch = GetBotsInMatch(names);

            if (IsBotSetupInvalid(botsInMatch))
            {
                return InvalidBotSetupError();
            }

            return PlayMatch(botsInMatch);
        }

        [Authorize]
        public ActionResult Commander()
        {
            return View();
        }

        private static IEnumerable<BotModel> GetTeamBotModels(IList<string> teams, int i, IEnumerable<Bot> bots)
        {
            var botNamesInTeam = GetBotNames(teams[i]);
            var botList = bots.ToList();
            var botModelsInTeam = new List<BotModel>();

            foreach (var botName in botNamesInTeam)
            {
                var bot = botList.First(x => x.MatchesName(botName));
                var model = new BotModel(bot);
                
                // Use a one based team id to avoid confusion with unassigned team id (0) 
                // if that would ever be useful
                model.TeamId = i + 1;

                botModelsInTeam.Add(model);
            }

            return botModelsInTeam;
        }

        private ActionResult PlayMatch(IEnumerable<Bot> bots)
        {
            var botModels = bots.Select(x => new BotModel(x)).ToList();

            return PlayMatch(botModels);
        }

        private ActionResult PlayMatch(IList<BotModel> botModels)
        {
            return View("PlayFullScreen", botModels);
        }

        private List<Bot> GetBotsInMatch(string names)
        {
            var botNames = GetBotNames(names).ToList();

            var bots = GetBots(botNames);

            var botsInMatch = new List<Bot>();

            foreach (var botName in botNames)
            {
                var matchingBot = bots.FirstOrDefault(x => x.Name == botName);

                if (matchingBot != null)
                    botsInMatch.Add(matchingBot);
            }
            return botsInMatch;
        }

        private IList<Bot> GetBots(IEnumerable<string> botNames)
        {
            var distinctNames = botNames.Distinct().ToList();
            var currentUserId = User.UserId();

            return Repository.Find<Bot>()
                .Where(x => distinctNames.Contains(x.Name) && (x.IsPublic || x.UserId == currentUserId))
                .Join<User, Bot>(x => x.Bots, x => x.User)
                .ExecuteList();
        }

        private bool IsBotSetupInvalid(IList<Bot> bots)
        {
            var currentUserId = User.UserId();

            var matchIncludesPrivateBots = bots.Any(x => !x.IsPublic);
            var matchIncludesBotsWrittenByAnotherUser = bots.Any(x => !x.IsTrainer && x.UserId != currentUserId);

            var isBotSetupInvalid = matchIncludesPrivateBots && matchIncludesBotsWrittenByAnotherUser;
            return isBotSetupInvalid;
        }

        private ActionResult InvalidBotSetupError()
        {
            return Error(
                "Your private bots are not allowed to participate in matches which include " +
                "bots written by other users. Make your bot public again to enable facing " +
                "other users' bots. Read the 'Private and Public Bots' section of the documentation " +
                "for more information");
        }

        private static IEnumerable<string> GetBotNames(string names)
        {
            return names.Split(',', ';');
        }

        private static List<BotModel> CreateBotModels(IList<string> rosters, IList<Bot> bots)
        {
            var botModels = new List<BotModel>();

            for (int i = 0; i < rosters.Count; i++)
            {
                var botModelsInTeam = GetTeamBotModels(rosters, i, bots);

                botModels.AddRange(botModelsInTeam);
            }
            return botModels;
        }
    }
}