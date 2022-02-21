using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using IA.MagicSuite.Authorization;

namespace IA.MagicSuite
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(MagicSuiteApplicationSharedModule),
        typeof(MagicSuiteCoreModule)
        )]
    public class MagicSuiteApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteApplicationModule).GetAssembly());
        }
    }
}