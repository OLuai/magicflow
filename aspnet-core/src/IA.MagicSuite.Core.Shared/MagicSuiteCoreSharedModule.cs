using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    public class MagicSuiteCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteCoreSharedModule).GetAssembly());
        }
    }
}