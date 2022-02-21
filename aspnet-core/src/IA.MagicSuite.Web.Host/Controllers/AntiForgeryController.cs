using Microsoft.AspNetCore.Antiforgery;

namespace IA.MagicSuite.Web.Controllers
{
    public class AntiForgeryController : MagicSuiteControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
