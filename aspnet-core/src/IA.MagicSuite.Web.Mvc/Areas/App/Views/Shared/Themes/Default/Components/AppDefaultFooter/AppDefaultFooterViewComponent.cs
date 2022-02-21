using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Web.Areas.App.Models.Layout;
using IA.MagicSuite.Web.Session;
using IA.MagicSuite.Web.Views;

namespace IA.MagicSuite.Web.Areas.App.Views.Shared.Themes.Default.Components.AppDefaultFooter
{
    public class AppDefaultFooterViewComponent : MagicSuiteViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppDefaultFooterViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var footerModel = new FooterViewModel
            {
                LoginInformations = await _sessionCache.GetCurrentLoginInformationsAsync()
            };

            return View(footerModel);
        }
    }
}
