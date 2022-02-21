using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using IA.MagicSuite.EntityFrameworkCore;

namespace IA.MagicSuite.HealthChecks
{
    public class MagicSuiteDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public MagicSuiteDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("MagicSuiteDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("MagicSuiteDbContext could not connect to database"));
        }
    }
}
