using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    [DependsOn(typeof(MagicSuiteCoreSharedModule))]
    public class MagicSuiteApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteApplicationSharedModule).GetAssembly());
        }
    }
}