using System.Web.Optimization;

namespace GosuArena
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/lib/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/game").Include(
                "~/Scripts/lib/signalR/jquery.signalR-2.2.0.min.js",
                "~/Scripts/lib/babylon.2.1.js",
                "~/Scripts/infrastructure/*.js",
                "~/Scripts/infrastructure/logging/*.js",
                "~/Scripts/gosu/math/*.js",
                "~/Scripts/gosu/*.js",
                "~/Scripts/game/augmentations/*.js",
                "~/Scripts/game/modifiers/*.js",
                "~/Scripts/game/*.js",
                "~/Scripts/Shaders/Water/waterMaterial.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryvalidation").Include(
                "~/Scripts/lib/jquery/jquery.unobtrusive*",
                "~/Scripts/lib/jquery/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Content/lib/bootstrap-3.0.3/js/dropdown.js"));

            bundles.Add(new ScriptBundle("~/bundles/menu").Include(
                "~/Scripts/menu/botWizard.js",
                "~/Scripts/menu/menu.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularspa").Include(
                "~/Scripts/angular/*.js",
                "~/Scripts/angular/account/*.js",
                "~/Scripts/angular/bot-wizard/*.js",
                "~/Scripts/angular/bots/*.js",
                "~/Scripts/angular/editor/*.js",
                "~/Scripts/angular/main-menu/*.js",
                "~/Scripts/angular/match-setup/*.js",
                "~/Scripts/angular/services/*.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/commanderlibs").Include(
                "~/Scripts/lib/jquery/jquery-{version}.js",
                "~/Scripts/lib/signalR/jquery.signalR-2.2.0.min.js",
                "~/signalr/hubs",
                "~/Scripts/lib/angular/angular.min.js",
                "~/Scripts/lib/angular/angular-route.js"));

            bundles.Add(new ScriptBundle("~/bundles/commander").Include(
                "~/Scripts/infrastructure/*.js",
                "~/Scripts/Pages/Commander/commander.js",
                "~/Scripts/Pages/Commander/Controllers/*.js",
                "~/Scripts/Pages/Commander/Services/*.js"
                ));

            //#if DEBUG
            //            BundleTable.EnableOptimizations = false;
            //#else
            //            BundleTable.EnableOptimizations = true;
            //#endif

            BundleTable.EnableOptimizations = false;
        }
    }
}