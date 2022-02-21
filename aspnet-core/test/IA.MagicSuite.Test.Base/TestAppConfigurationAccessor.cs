using Abp.Dependency;
using Abp.Reflection.Extensions;
using Microsoft.Extensions.Configuration;
using IA.MagicSuite.Configuration;

namespace IA.MagicSuite.Test.Base
{
    public class TestAppConfigurationAccessor : IAppConfigurationAccessor, ISingletonDependency
    {
        public IConfigurationRoot Configuration { get; }

        public TestAppConfigurationAccessor()
        {
            Configuration = AppConfigurations.Get(
                typeof(MagicSuiteTestBaseModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }
    }
}
