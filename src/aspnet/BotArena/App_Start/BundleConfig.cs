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

            bundles.Add(new ScriptBundle("~/bundles/jqueryvalidation").Include(
                "~/Scripts/lib/jquery/jquery.unobtrusive*",
                "~/Scripts/lib/jquery/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Content/lib/bootstrap-3.0.3/js/dropdown.js"));

            bundles.Add(new ScriptBundle("~/bundles/babylon").Include(
                "~/Scripts/lib/babylon.2.1.js"));

            bundles.Add(new ScriptBundle("~/bundles/gosuarena").Include(
                "~/Scripts/infrastructure/*.js",
                "~/Scripts/gosu/math/*.js",
                "~/Scripts/gosu/*.js",
                "~/Scripts/game/augmentations/*.js",
                "~/Scripts/game/modifiers/*.js",
                "~/Scripts/game/modifiers/classes/*.js",
                "~/Scripts/game/modifiers/equipment/*.js",
                "~/Scripts/game/*.js",
                "~/Scripts/Shaders/Water/waterMaterial.js"));

            bundles.Add(new ScriptBundle("~/bundles/menu").Include(
                "~/Scripts/menu/botWizard.js",
                "~/Scripts/menu/menu.js"));

            //#if DEBUG
            //            BundleTable.EnableOptimizations = false;
            //#else
            //            BundleTable.EnableOptimizations = true;
            //#endif

            BundleTable.EnableOptimizations = false;
        }
    }
}