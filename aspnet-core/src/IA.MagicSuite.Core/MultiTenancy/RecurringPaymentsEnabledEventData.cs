using Abp.Events.Bus;

namespace IA.MagicSuite.MultiTenancy
{
    public class RecurringPaymentsEnabledEventData : EventData
    {
        public int TenantId { get; set; }
    }
}