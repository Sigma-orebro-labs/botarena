using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using GosuArena.Infrastructure.Graphics;

namespace GosuArena.Controllers.Api
{
    public class BotNameImageController : ApiController
    {
        // Example URI: http://localhost/botarena/api/botnameimage?name=turnbot&colorHexCode=%23fe4689
        public HttpResponseMessage Get([FromUri]string name, [FromUri]string colorHexCode)
        {
            var imageRenderer = new ImageRenderer();
            var memoryStream = new MemoryStream();

            imageRenderer.RenderNameImageToStream(name, colorHexCode, memoryStream);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(memoryStream.ToArray())
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

            return result;
        }
    }
}