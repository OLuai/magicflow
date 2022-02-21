using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Web.Session;

namespace IA.MagicSuite.Web.Views.Shared.Components.AccountLogo
{
    public class AccountLogoViewComponent : MagicSuiteViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AccountLogoViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync(string skin)
        {
            var loginInfo = await _sessionCache.GetCurrentLoginInformationsAsync();
            return View(new AccountLogoViewModel(loginInfo, skin));
        }
    }
}
