using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Web.Areas.App.Models.Layout;
using IA.MagicSuite.Web.Session;
using IA.MagicSuite.Web.Views;

namespace IA.MagicSuite.Web.Areas.App.Views.Shared.Themes.Theme11.Components.AppTheme11Footer
{
    public class AppTheme11FooterViewComponent : MagicSuiteViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppTheme11FooterViewComponent(IPerRequestSessionCache sessionCache)
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
