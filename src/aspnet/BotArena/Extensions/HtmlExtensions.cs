using System.Web.Mvc;
using System.Web.Mvc.Html;
using GosuArena.Models.Controls;

namespace GosuArena.Extensions
{
    public static class HtmlExtensions
    {
        public static string ControllerName(this HtmlHelper html)
        {
            return html.ViewContext.RouteData.GetRequiredString("controller");
        }

        public static string ActionName(this HtmlHelper html)
        {
            return html.ViewContext.RouteData.GetRequiredString("action");
        }
    }
}