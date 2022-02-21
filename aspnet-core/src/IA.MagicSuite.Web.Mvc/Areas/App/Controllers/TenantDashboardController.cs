using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using IA.MagicSuite.Authorization;
using IA.MagicSuite.DashboardCustomization;
using System.Threading.Tasks;
using IA.MagicSuite.Web.Areas.App.Startup;

namespace IA.MagicSuite.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
    public class TenantDashboardController : CustomizableDashboardControllerBase
    {
        public TenantDashboardController(DashboardViewConfiguration dashboardViewConfiguration, 
            IDashboardCustomizationAppService dashboardCustomizationAppService) 
            : base(dashboardViewConfiguration, dashboardCustomizationAppService)
        {

        }

        public async Task<ActionResult> Index()
        {
            return await GetView(MagicSuiteDashboardCustomizationConsts.DashboardNames.DefaultTenantDashboard);
        }
    }
}