using System;
using System.Web.Mvc;
using GosuArena.Infrastructure.Authorization;

namespace GosuArena.Controllers
{
    public class ErrorController : BaseController
    {
        [Admin]
        public ActionResult Create()
        {
            throw new InvalidOperationException();
        }
    }
}