using Abp.AspNetCore.Mvc.ViewComponents;

namespace IA.MagicSuite.Web.Public.Views
{
    public abstract class MagicSuiteViewComponent : AbpViewComponent
    {
        protected MagicSuiteViewComponent()
        {
            LocalizationSourceName = MagicSuiteConsts.LocalizationSourceName;
        }
    }
}