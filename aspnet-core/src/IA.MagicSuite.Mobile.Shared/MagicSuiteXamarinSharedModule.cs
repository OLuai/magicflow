using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    [DependsOn(typeof(MagicSuiteClientModule), typeof(AbpAutoMapperModule))]
    public class MagicSuiteXamarinSharedModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteXamarinSharedModule).GetAssembly());
        }
    }
}