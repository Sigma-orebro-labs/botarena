using System.Net;
using System.Net.Http;
using System.Web.Http;
using GosuArena.Entities;
using GosuArena.Models.Account;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class AuthSessionController : ApiController
    {
        private readonly AuthService _authService = new AuthService();

        // Check if the current user has an auth session
        [Route("/api/AuthSession/Current")]
        public HttpResponseMessage GetCurrent()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Request.CreateResponse(HttpStatusCode.OK, GetUserModel(User.Identity.Name));
            }

            return Request.CreateResponse(HttpStatusCode.NotFound, "The current user has no auth session");
        }

        // Create a new auth session for the current user (log in)
        public HttpResponseMessage Post(LogOnModel model)
        {
            var wasLoggedIn = _authService.TryLogin(model.UserName, model.Password, model.RememberMe);

            if (wasLoggedIn)
            {
                return Request.CreateResponse(HttpStatusCode.OK, GetUserModel(model.UserName));
            }

            return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Login failed");
        }

        // Delete the current auth session (log off)
        [Route("/api/AuthSession/Current")]
        public void DeleteCurrent()
        {
            _authService.LogOff();
        }

        private object GetUserModel(string username)
        {
            var currentUser = _authService.GetUser(username);

            return new
            {
                username = currentUser.Username,
                currentUser.Email
            };
        }
    }
}