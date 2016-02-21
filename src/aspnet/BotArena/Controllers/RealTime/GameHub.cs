using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Web;
using GosuArena.Entities;
using GosuArena.Extensions;
using GosuArena.Models.Commander;
using GosuArena.Services;
using Microsoft.AspNet.SignalR;
using WeenyMapper;

namespace GosuArena.Controllers.RealTime
{
    public class GameHub : Hub
    {
        private static ConcurrentDictionary<string, GameModel> _games = new ConcurrentDictionary<string, GameModel>();

        public void Subscribe(string gameId)
        {
            Groups.Add(Context.ConnectionId, gameId);
        }

        public void Unsubscribe(string gameId)
        {
            Groups.Remove(Context.ConnectionId, gameId);
        }

        public void UnsubscribeMany(string[] gameIds)
        {
            foreach (var id in gameIds)
            {
                Unsubscribe(id);
            }
        }

        public GameModel[] GetOpenGameRooms()
        {
            CleanUpInactiveGameRooms();

            return _games.Values.ToArray();
        }

        private void CleanUpInactiveGameRooms()
        {
            foreach (var game in _games.Values.Where(x => x.LastPingTime < DateTime.Now.AddMinutes(-1)).ToList())
            {
                GameModel removed;
                _games.TryRemove(game.Id, out removed);
            }
        }

        public GameModel GetGameRoomForCurrentUser(string id)
        {
            if (!_games.ContainsKey(id))
                return null;

            return GameModel.CreateCopyForUser(_games[id], HttpContext.Current.User.UserId());
        }

        public GameModel GetGameRoom(string id)
        {
            return _games.ContainsKey(id) ? _games[id] : null;
        }

        public CommanderBotModel GetBot(string roomId, int botId)
        {
            var game = GetGameRoom(roomId);
            return game.Bots.FirstOrDefault(x => x.Id == botId);
        }

        public void Ping(string roomId)
        {
            var room = GetGameRoom(roomId);

            if (room != null)
                room.LastPingTime = DateTime.Now;
        }

        public GameModel CreateGameRoom()
        {
            var generator = new NameGenerator();
            var name = generator.GenerateUnique(_games.Keys);

            var gameModel = new GameModel(name);

            _games[gameModel.Id] = gameModel;

            Subscribe(name);
            
            return gameModel;
        }

        public void GameStarting(string roomId, CommanderBotModel[] bots)
        {
            var repository = new Repository();
            var names = bots.Select(x => x.Name).ToList();

            var botEntities = repository
                .Find<Bot>().Select(x => x.Id, x => x.Name, x => x.UserId)
                .Where(x => names.Contains(x.Name))
                .ExecuteList();

            foreach (var bot in bots)
            {
                bot.UserId = botEntities.Single(x => x.MatchesName(bot.Name)).UserId;
            }

            var room = GetGameRoom(roomId);

            room.Bots = bots.ToList();
        }

        public void OnCommand(string roomId, int botId, string commandName)
        {
            var bot = GetBot(roomId, botId);

            if (bot.UserId == HttpContext.Current.User.UserId())
            {
                Clients.Group(roomId).onCommand(roomId, botId, commandName);
            }
        }

        public void Foo(string bar)
        {
            Clients.All.foo();
        }
    }
}
