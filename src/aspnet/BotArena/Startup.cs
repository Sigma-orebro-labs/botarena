using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(GosuArena.Startup))]

namespace GosuArena
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
