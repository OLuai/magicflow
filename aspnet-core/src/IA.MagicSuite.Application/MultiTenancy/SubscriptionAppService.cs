﻿using System.Threading.Tasks;
using Abp.Events.Bus;
using Abp.Runtime.Session;
using IA.MagicSuite.MultiTenancy.Payments;

namespace IA.MagicSuite.MultiTenancy
{
    public class SubscriptionAppService : MagicSuiteAppServiceBase, ISubscriptionAppService
    {
        public IEventBus EventBus { get; set; }

        public SubscriptionAppService()
        {
            EventBus = NullEventBus.Instance;
        }

        public async Task DisableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringAutomatic)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringManual;
                    await EventBus.TriggerAsync(new RecurringPaymentsDisabledEventData
                    {
                        TenantId = AbpSession.GetTenantId(),
                        EditionId = tenant.EditionId.Value
                    });
                }
            }
        }

        public async Task EnableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringManual)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringAutomatic;
                    tenant.SubscriptionEndDateUtc = null;

                    await EventBus.TriggerAsync(new RecurringPaymentsEnabledEventData
                    {
                        TenantId = AbpSession.GetTenantId()
                    });
                }
            }
        }
    }
}
