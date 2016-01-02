using System.Net;
using System.Net.Http;
using System.Web.Http;
using GosuArena.Entities;
using GosuArena.Models.Account;
using WeenyMapper;

namespace GosuArena.Controllers.Api
{
    public class AccountsController : ApiController
    {
        Repository _repository = new Repository();

        public HttpResponseMessage Post(LogOnModel model)
        {
            return new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }

        [Route("api/accounts/current/password")]
        public HttpResponseMessage PutNewPassword(ChangePasswordModel model)
        {
            var user = _repository.Find<User>().Where(x => x.Username == User.Identity.Name).Execute();

            if (user == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            if (!user.IsPasswordValid(model.OldPassword))
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid credentials");
            }

            user.SetPassword(model.NewPassword);
            _repository.Update(user);

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}