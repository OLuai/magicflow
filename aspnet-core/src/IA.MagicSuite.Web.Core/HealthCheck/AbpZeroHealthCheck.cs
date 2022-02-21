using Microsoft.Extensions.DependencyInjection;
using IA.MagicSuite.HealthChecks;

namespace IA.MagicSuite.Web.HealthCheck
{
    public static class AbpZeroHealthCheck
    {
        public static IHealthChecksBuilder AddAbpZeroHealthCheck(this IServiceCollection services)
        {
            var builder = services.AddHealthChecks();
            builder.AddCheck<MagicSuiteDbContextHealthCheck>("Database Connection");
            builder.AddCheck<MagicSuiteDbContextUsersHealthCheck>("Database Connection with user check");
            builder.AddCheck<CacheHealthCheck>("Cache");

            // add your custom health checks here
            // builder.AddCheck<MyCustomHealthCheck>("my health check");

            return builder;
        }
    }
}
