using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Web.Controllers;

namespace IA.MagicSuite.Web.Public.Controllers
{
    public class HomeController : MagicSuiteControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}