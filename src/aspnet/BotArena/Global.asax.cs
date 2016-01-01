using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using GosuArena.Infrastructure;
using WeenyMapper;

namespace GosuArena
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


#if (SQLE)
            Repository.DefaultConnectionString = ConfigurationManager.ConnectionStrings["GosuArenaExpress"].ConnectionString;
#else
            Repository.DefaultConnectionString = ConfigurationManager.ConnectionStrings["GosuArena"].ConnectionString;
#endif

            Repository.DefaultConvention = new DatabaseConvention();
        }
    }
}