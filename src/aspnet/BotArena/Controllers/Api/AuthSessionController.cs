using System.Net;
using System.Net.Http;
using System.Web.Http;
using GosuArena.Models.Account;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class AuthSessionController : ApiController
    {
        private readonly AuthService _authService = new AuthService();

        public HttpResponseMessage Post(LogOnModel model)
        {
            var wasLoggedIn = _authService.TryLogin(model.UserName, model.Password, model.RememberMe);

            if (wasLoggedIn)
            {
                return new HttpResponseMessage(HttpStatusCode.OK);
            }

            return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Login failed");
        }

        public void Delete()
        {
            _authService.LogOff();
        }
    }
}