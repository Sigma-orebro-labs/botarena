using System.Configuration;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Infrastructure;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public abstract class BaseController : Controller
    {
        protected Repository Repository = new Repository(); 

        protected int GetCurrentUserId()
        {
            return Repository.Find<User>()
                .Where(x => x.Username == User.Identity.Name)
                .Select(x => x.Id)
                .ExecuteScalar<int>();
        }

        protected ActionResult Error(string message)
        {
            ViewBag.ErrorMessage = message;

            return View("Error");
        }
    }
}
