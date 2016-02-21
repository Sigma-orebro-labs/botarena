using System.Web.Mvc;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public abstract class BaseController : Controller
    {
        protected Repository Repository = new Repository(); 

        protected ActionResult Error(string message)
        {
            ViewBag.ErrorMessage = message;

            return View("Error");
        }
    }
}
