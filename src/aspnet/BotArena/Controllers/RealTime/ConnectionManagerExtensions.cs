using GosuArena.Models.RealTime;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace GosuArena.Controllers.RealTime
{
    public static class ConnectionManagerExtensions
    {
        public static void TriggerEvent(this IConnectionManager connectionManager, int gameId, EventTriggerModel eventTriggerModel)
        {
            connectionManager.GetGroup(gameId).
            connectionManager.GetGroup(gameId).triggerEvent(eventTriggerModel.BotId, eventTriggerModel.EventName);
        }

        private static dynamic GetGroup(this IConnectionManager connectionManager, int gameId)
        {
            var boardHub = connectionManager.GetHubContext<GameHub>();

            return boardHub.Clients.Group(gameId.ToString());
        }
    }
}
