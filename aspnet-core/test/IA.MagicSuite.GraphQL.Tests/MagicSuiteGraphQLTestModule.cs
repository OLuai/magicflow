using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using IA.MagicSuite.Configure;
using IA.MagicSuite.Startup;
using IA.MagicSuite.Test.Base;

namespace IA.MagicSuite.GraphQL.Tests
{
    [DependsOn(
        typeof(MagicSuiteGraphQLModule),
        typeof(MagicSuiteTestBaseModule))]
    public class MagicSuiteGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteGraphQLTestModule).GetAssembly());
        }
    }
}