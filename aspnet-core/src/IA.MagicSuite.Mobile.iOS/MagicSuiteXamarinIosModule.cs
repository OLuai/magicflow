using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    [DependsOn(typeof(MagicSuiteXamarinSharedModule))]
    public class MagicSuiteXamarinIosModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteXamarinIosModule).GetAssembly());
        }
    }
}