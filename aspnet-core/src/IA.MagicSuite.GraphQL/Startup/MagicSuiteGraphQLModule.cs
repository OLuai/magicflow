using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite.Startup
{
    [DependsOn(typeof(MagicSuiteCoreModule))]
    public class MagicSuiteGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}