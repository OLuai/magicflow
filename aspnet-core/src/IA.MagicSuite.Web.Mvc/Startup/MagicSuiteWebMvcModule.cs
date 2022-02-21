using Abp.AspNetZeroCore;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Threading.BackgroundWorkers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using IA.MagicSuite.Auditing;
using IA.MagicSuite.Configuration;
using IA.MagicSuite.EntityFrameworkCore;
using IA.MagicSuite.MultiTenancy;
using IA.MagicSuite.Web.Areas.App.Startup;

namespace IA.MagicSuite.Web.Startup
{
    [DependsOn(
        typeof(MagicSuiteWebCoreModule)
    )]
    public class MagicSuiteWebMvcModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public MagicSuiteWebMvcModule(IWebHostEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            Configuration.Modules.AbpWebCommon().MultiTenancy.DomainFormat = _appConfiguration["App:WebSiteRootAddress"] ?? "https://localhost:44302/";
            Configuration.Modules.AspNetZero().LicenseCode = _appConfiguration["AbpZeroLicenseCode"];
            Configuration.Navigation.Providers.Add<AppNavigationProvider>();
            
            IocManager.Register<DashboardViewConfiguration>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteWebMvcModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!IocManager.Resolve<IMultiTenancyConfig>().IsEnabled)
            {
                return;
            }

            using (var scope = IocManager.CreateScope())
            {
                if (!scope.Resolve<DatabaseCheckHelper>().Exist(_appConfiguration["ConnectionStrings:Default"]))
                {
                    return;
                }
            }

            var workManager = IocManager.Resolve<IBackgroundWorkerManager>();
            workManager.Add(IocManager.Resolve<SubscriptionExpirationCheckWorker>());
            workManager.Add(IocManager.Resolve<SubscriptionExpireEmailNotifierWorker>());

            if (Configuration.Auditing.IsEnabled && ExpiredAuditLogDeleterWorker.IsEnabled)
            {
                workManager.Add(IocManager.Resolve<ExpiredAuditLogDeleterWorker>());
            }
        }
    }
}