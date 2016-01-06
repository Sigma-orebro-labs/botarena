using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace GosuArena.Controllers.Api
{
    public class ApiControllerBase : ApiController
    {
        protected HttpResponseMessage JsonString(string jsonString)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");
            return response;
        }
    }
}