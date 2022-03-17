using IA.MagicSuite.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IA.MagicSuite.Web.Areas.App.Controllers
{
    [Area("App")]
    public class MagicPortalController : MagicSuiteControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
