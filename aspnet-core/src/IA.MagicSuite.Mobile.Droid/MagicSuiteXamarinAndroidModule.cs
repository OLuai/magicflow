using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    [DependsOn(typeof(MagicSuiteXamarinSharedModule))]
    public class MagicSuiteXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteXamarinAndroidModule).GetAssembly());
        }
    }
}