using System;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Extensions;

namespace GosuArena.Controllers
{
    public class UserController : BaseController
    {
        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RegenerateApiKey()
        {
            var newKey = Guid.NewGuid().ToString();

            Repository.Update<User>()
                .Set(x => x.ApiKey, newKey)
                .Where(x => x.Id == User.UserId())
                .Execute();

            return RedirectToAction("MyProfile");
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EnableApiAccess()
        {
            SetApiAccessAllowed(true);
            
            return RedirectToAction("MyProfile");
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult DisableApiAccess()
        {
            SetApiAccessAllowed(false);

            return RedirectToAction("MyProfile");
        }

        private void SetApiAccessAllowed(bool isApiAccessAllowed)
        {
            Repository.Update<User>()
                .Set(x => x.IsApiAccessAllowed, isApiAccessAllowed)
                .Where(x => x.Id == User.UserId())
                .Execute();
        }
    }
}
