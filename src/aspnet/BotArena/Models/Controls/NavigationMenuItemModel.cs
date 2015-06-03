using System.Web.Mvc;
using GosuArena.Extensions;

namespace GosuArena.Models.Controls
{
    public class NavigationMenuItemModel
    {
        public NavigationMenuItemModel(string actionName, string controllerName, string linkText)
        {
            ActionName = actionName;
            ControllerName = controllerName;
            LinkText = linkText;
        }

        public readonly string ActionName;
        public readonly string ControllerName;
        public readonly string LinkText;

        public bool IsCurrentPage(HtmlHelper html)
        {
            return html.ActionName().ToLower() == ActionName.ToLower() &&
                   html.ControllerName().ToLower() == ControllerName.ToLower();
        }
    }
}