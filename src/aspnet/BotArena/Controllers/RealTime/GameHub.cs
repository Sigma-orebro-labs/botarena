using System;
using System.Collections.Concurrent;
using System.Linq;
using GosuArena.Models.Commander;
using GosuArena.Services;
using Microsoft.AspNet.SignalR;

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

        public GameModel GetGameRoom(string id)
        {
            return _games[id];
        }

        public CommanderBotModel GetBot(string roomId, int botId)
        {
            var game = GetGameRoom(roomId);
            return game.Bots.FirstOrDefault(x => x.Id == botId);
        }

        public void Ping(string roomId)
        {
            var room = GetGameRoom(roomId);
            room.LastPingTime = DateTime.Now;
        }

        public GameModel CreateGameRoom()
        {
            var generator = new NameGenerator();
            var name = generator.GenerateUnique(_games.Keys);

            var gameModel = new GameModel(name);

            _games[gameModel.Id] = gameModel;

            return gameModel;
        }

        public void GameStarting(string roomId, CommanderBotModel[] bots)
        {
            var room = GetGameRoom(roomId);
            room.Bots = bots.ToList();
        }

        public void Foo(string bar)
        {
            Clients.All.foo();
        }
    }
}
