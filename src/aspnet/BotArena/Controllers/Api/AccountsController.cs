using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAnnotationsExtensions;
using GosuArena.Entities;
using GosuArena.Extensions;
using GosuArena.Models.Account;
using WeenyMapper;

namespace GosuArena.Controllers.Api
{
    public class AccountsController : ApiController
    {
        readonly Repository _repository = new Repository();

        public HttpResponseMessage Post(RegisterModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Confirm password does not match new password");
            }

            if (string.IsNullOrWhiteSpace(model.UserName))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid username");
            }
            
            if (!new EmailAttribute().IsValid(model.Email))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid email");
            }

            var existingUserCount = _repository.Count<User>().Where(x => x.Username == model.UserName).Execute();

            if (existingUserCount > 0)
            {
                return Request.CreateResponse(HttpStatusCode.Conflict, "Username is already in use");
            }
            
            var user = new User
            {
                Username = model.UserName,
                Email = model.Email
            };

            user.SetPassword(model.Password);

            _repository.Insert(user);

            return Request.CreateResponse(HttpStatusCode.Created, new ApiUserModel(user));
        }

        [Route("api/accounts/current/password")]
        public HttpResponseMessage PutNewPassword(ChangePasswordModel model)
        {
            var user = _repository.Find<User>().Where(x => x.Id == User.UserId()).Execute();

            if (user == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Confirm password does not match new password");
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