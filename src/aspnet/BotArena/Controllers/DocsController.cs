using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GosuArena.Controllers
{
    public class DocsController : Controller
    {
        //
        // GET: /Docs/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult News()
        {
            return View();
        }
    }
}
