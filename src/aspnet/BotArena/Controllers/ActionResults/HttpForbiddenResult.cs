using System.Web.Mvc;

namespace GosuArena.Controllers.ActionResults
{
    public class HttpForbiddenResult : HttpStatusCodeResult
    {
        // HTTP 403 is the status code for Forbidden
        private const int ForbiddenCode = 403;

        public HttpForbiddenResult() : this(null) { }
        public HttpForbiddenResult(string statusDescription) : base(ForbiddenCode, statusDescription) { }
    }
}