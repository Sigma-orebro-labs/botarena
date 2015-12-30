using System.Net;
using System.Net.Http;
using System.Web.Http;
using GosuArena.Models.Account;

namespace GosuArena.Controllers
{
    public class AccountApiController : ApiController
    {
        public HttpResponseMessage Post(LogOnModel model)
        {
            return new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }
    }
}