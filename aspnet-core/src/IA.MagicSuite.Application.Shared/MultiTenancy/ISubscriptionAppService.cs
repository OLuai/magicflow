using System.Threading.Tasks;
using Abp.Application.Services;

namespace IA.MagicSuite.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
