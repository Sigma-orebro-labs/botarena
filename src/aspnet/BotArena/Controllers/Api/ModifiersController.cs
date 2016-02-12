using System.IO;
using System.Net.Http;
using System.Web;

namespace GosuArena.Controllers.Api
{
    public class ModifiersController : ApiControllerBase
    {
        public HttpResponseMessage Get()
        {
            var path = HttpContext.Current.Server.MapPath("~/Scripts/game/modifiers/modifierConfig.json");
            return JsonString(File.ReadAllText(path));
        }
    }
}