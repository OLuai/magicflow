using Abp.AspNetCore.Mvc.Views;

namespace IA.MagicSuite.Web.Views
{
    public abstract class MagicSuiteRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected MagicSuiteRazorPage()
        {
            LocalizationSourceName = MagicSuiteConsts.LocalizationSourceName;
        }
    }
}
