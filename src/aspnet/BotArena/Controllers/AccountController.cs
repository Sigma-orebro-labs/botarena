using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using GosuArena.Entities;
using GosuArena.Infrastructure.Authorization;
using GosuArena.Models;
using GosuArena.Models.Account;

namespace GosuArena.Controllers
{
    public class AccountController : BaseController
    {
        public ActionResult Login()
        {
            return View(new LogOnModel());
        }

        [HttpPost]
        public ActionResult Login(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (IsValid(model.UserName, model.Password))
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);

                    Repository.Update<User>()
                        .Set(x => x.LastLoginDate, DateTime.Now)
                        .Where(x => x.Username == model.UserName)
                        .Execute();

                    return RedirectToReturnUrl(returnUrl);
                }

                ModelState.AddModelError("", "The user name or password provided is incorrect.");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult Register()
        {
            return View(new RegisterModel());
        }

        [HttpPost]
        public ActionResult Register(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var existingUser = Repository.Find<User>().Where(x => x.Username == model.UserName).Execute();

            if (existingUser != null)
            {
                ModelState.AddModelError("", "There username is already taken");
                return View(model);
            }

            var user = new User
            {
                Username = model.UserName,
                Email = model.Email
            };

            user.SetPassword(model.Password);

            Repository.Insert(user);

            return RedirectToAction("Login", "Account");
        }

        private ActionResult RedirectToReturnUrl(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index", "Match");
        }

        private bool IsValid(string username, string password)
        {
            var user = Repository.Find<User>()
                .Where(x => x.Username == username)
                .ExecuteList()
                .FirstOrDefault();

            if (user == null)
                return false;

            return user.IsPasswordValid(password);
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Match");
        }

        [Authorize]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [Authorize]
        [ValidateAntiForgeryToken]        
        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                // ChangePassword will throw an exception rather
                // than return false in certain failure scenarios.
                var user = Repository.Find<User>().Where(x => x.Username == User.Identity.Name).Execute();

                if (user != null && user.IsPasswordValid(model.OldPassword))
                {
                    user.SetPassword(model.NewPassword);
                    Repository.Update(user);

                    return RedirectToAction("ChangePasswordSuccess");
                }
            }

            // If we got this far, something failed, redisplay form
            ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");

            return View(model);
        }

        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        public ActionResult ConfirmResetPassword(string username)
        {
            return View(username);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword(int id)
        {
            var user = Repository.Find<User>().Where(x => x.Id == id).Execute();

            var plainTextPassword = Membership.GeneratePassword(8, 0);
            user.SetPassword(plainTextPassword);

            Repository.Update(user);

            return Content(plainTextPassword);
        }

        [Admin]
        public ActionResult List()
        {
            var users = Repository.Find<User>()
                .Join<User, Bot>(x => x.Bots, x => x.User)
                .OrderBy(x => x.Username)
                .ExecuteList();

            return View(users);
        }
    }
}