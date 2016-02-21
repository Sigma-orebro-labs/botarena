using System.Collections.Concurrent;
using System.Linq;
using GosuArena.Models.Commander;
using GosuArena.Services;
using Microsoft.AspNet.SignalR;

namespace GosuArena.Controllers.RealTime
{
    public class GameHub : Hub
    {
        private static ConcurrentBag<GameModel> _games = new ConcurrentBag<GameModel>();

        public void Subscribe(string gameId)
        {
            Groups.Add(Context.ConnectionId, gameId);
        }

        public GameModel[] GetOpenGameRooms()
        {
            return _games.ToArray();
        }

        public GameModel GetGameRoom(string id)
        {
            return _games.FirstOrDefault(x => x.Id == id);
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

        public GameModel CreateGameRoom()
        {
            var generator = new NameGenerator();
            var name = generator.GenerateUnique(_games.Select(x => x.Id));

            var gameModel = new GameModel(name);

            _games.Add(gameModel);

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
