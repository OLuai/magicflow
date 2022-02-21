using Microsoft.Extensions.Configuration;

namespace IA.MagicSuite.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
