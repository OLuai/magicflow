using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.MultiTenancy.Payments.Dto;
using IA.MagicSuite.MultiTenancy.Payments.Stripe.Dto;

namespace IA.MagicSuite.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}