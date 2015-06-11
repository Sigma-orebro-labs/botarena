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
                        "~/Content/bootstrap-3.0.3/js/dropdown.js"));

            bundles.Add(new ScriptBundle("~/bundles/threejs").Include(
                        "~/Scripts/lib/threejs/three.js",
                        "~/Scripts/lib/threejs/OrbitControls.js",
                        "~/Scripts/lib/threejs/loaders/*.js"));

//#if DEBUG
//            BundleTable.EnableOptimizations = false;
//#else
//            BundleTable.EnableOptimizations = true;
//#endif

            BundleTable.EnableOptimizations = false;


            bundles.Add(new ScriptBundle("~/bundles/gosuarena").Include(
                "~/Scripts/gosu/math/*.js",
                "~/Scripts/gosu/*.js",
                "~/Scripts/game/*.js"));
        }
    }
}