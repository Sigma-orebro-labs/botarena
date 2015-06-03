using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace GosuArena
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "BotApi",
                routeTemplate: "api/bot/{id}",
                defaults: new { controller = "BotApi" }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
