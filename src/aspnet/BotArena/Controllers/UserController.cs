using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Models;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class UserController : BaseController
    {
        [Authorize]
        public ActionResult MyProfile()
        {
            var username = User.Identity.Name;

            return RedirectToAction("Profile", new { username = username });
        }

        [Authorize]
        public new ActionResult Profile(string username)
        {
            var user = GetUserWithBots(username);

            if (user == null)
            {
                return new HttpNotFoundResult();
            }

            var isCurrentUserProfile = username == User.Identity.Name;

            if (isCurrentUserProfile)
                return View(user);

            return View("ReadOnlyProfile", user);
        }

        protected User GetUserWithBots(string username)
        {
            return Repository.Find<User>()
                .Where(x => x.Username == username)
                .Join(x => x.Bots, x => x.User)
                .Execute();
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RegenerateApiKey()
        {
            var newKey = Guid.NewGuid().ToString();

            Repository.Update<User>()
                .Set(x => x.ApiKey, newKey)
                .Where(x => x.Id == GetCurrentUserId())
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
                .Where(x => x.Id == GetCurrentUserId())
                .Execute();
        }
    }
}
