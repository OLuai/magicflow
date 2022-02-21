using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.MultiTenancy.Payments.PayPal.Dto;

namespace IA.MagicSuite.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
