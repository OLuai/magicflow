using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Web.Areas.App.Models.Layout;
using IA.MagicSuite.Web.Views;

namespace IA.MagicSuite.Web.Areas.App.Views.Shared.Components.
    AppQuickThemeSelect
{
    public class AppQuickThemeSelectViewComponent : MagicSuiteViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(string cssClass)
        {
            return Task.FromResult<IViewComponentResult>(View(new QuickThemeSelectionViewModel
            {
                CssClass = cssClass
            }));
        }
    }
}
