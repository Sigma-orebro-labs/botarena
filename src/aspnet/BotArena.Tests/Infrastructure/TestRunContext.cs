using System.Security.Principal;
using System.Threading;

namespace BotArena.Tests.Infrastructure
{
    public class TestRunContext
    {
        public static void SetCurrentIdentity(int userId)
        {
            var identity = new GenericIdentity(userId.ToString());
            Thread.CurrentPrincipal = new GenericPrincipal(identity, null);
        }
    }
}