//using Microsoft.AspNet.SignalR;

//namespace TaskBoard.Web.Controllers.RealTime
//{
//    public class BoardHub : Hub
//    {
//        public void Subscribe(string boardId)
//        {
//            Groups.Add(Context.ConnectionId, boardId);
//        }

//        public void Unsubscribe(string boardId)
//        {
//            Groups.Remove(Context.ConnectionId, boardId);
//        }

//        public void UnsubscribeMany(string[] boardIds)
//        {
//            foreach (var id in boardIds)
//            {
//                Unsubscribe(id);
//            }
//        }
//    }
//}
