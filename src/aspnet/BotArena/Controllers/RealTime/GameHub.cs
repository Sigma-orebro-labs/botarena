using System.Collections.Concurrent;
using GosuArena.Services;
using Microsoft.AspNet.SignalR;

namespace GosuArena.Controllers.RealTime
{
    public class GameHub : Hub
    {
        private static ConcurrentBag<string> _games = new ConcurrentBag<string>();

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

        public string CreateGameRoom()
        {
            var generator = new NameGenerator();
            var name = generator.GenerateUnique(_games);

            _games.Add(name);

            return name;
        }

        public void Foo(string bar)
        {
            Clients.All.foo();
        }
    }
}
