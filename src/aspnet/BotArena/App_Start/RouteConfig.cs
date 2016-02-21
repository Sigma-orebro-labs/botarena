﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace GosuArena
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });
            routes.IgnoreRoute("robots.txt");
            
            AddBabylonManifestRoute(routes, "Match/BotArena/Content/models/");;
            AddBabylonManifestRoute(routes, "Content/models/");;

            routes.MapRoute(
                name: "User profile",
                url: "Profile/{username}",
                defaults: new { controller = "User", action = "Profile" });

            routes.MapRoute(
                name: "Play match",
                url: "Play/{names}",
                defaults: new { controller = "Match", action = "Play" });
            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Match", action = "Index", id = UrlParameter.Optional }
            );
        }

        private static void AddBabylonManifestRoute(RouteCollection routes, string prefixPath)
        {
            routes.MapRoute(
                name: $"Babylon resource manifest '{prefixPath}'",
                url: prefixPath + "{manifestpath}",
                defaults: new {controller = "Resources", action = "BabylonManifest"},
                constraints: new {manifestpath = @".*\.babylon\.manifest.*"});
        }
    }
}