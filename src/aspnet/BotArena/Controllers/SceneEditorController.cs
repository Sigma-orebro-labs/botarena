using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Models.Match;
using WeenyMapper.Extensions;

namespace GosuArena.Controllers
{
    public class SceneEditorController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}