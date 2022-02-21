using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace IA.MagicSuite.Web.Public.Views
{
    public abstract class MagicSuiteRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected MagicSuiteRazorPage()
        {
            LocalizationSourceName = MagicSuiteConsts.LocalizationSourceName;
        }
    }
}
