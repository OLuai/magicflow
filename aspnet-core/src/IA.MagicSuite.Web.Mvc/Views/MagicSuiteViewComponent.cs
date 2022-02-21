using Abp.AspNetCore.Mvc.ViewComponents;

namespace IA.MagicSuite.Web.Views
{
    public abstract class MagicSuiteViewComponent : AbpViewComponent
    {
        protected MagicSuiteViewComponent()
        {
            LocalizationSourceName = MagicSuiteConsts.LocalizationSourceName;
        }
    }
}