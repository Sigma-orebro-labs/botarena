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

#if !DEBUG
            BundleTable.EnableOptimizations = true;
#endif

            bundles.Add(new ScriptBundle("~/bundles/gosuarena").Include(
                "~/Scripts/gosu/math/*.js",
                "~/Scripts/gosu/*.js",
                "~/Scripts/game/*.js"));
        }
    }
}