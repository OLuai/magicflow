using IA.MagicSuite.MultiTenancy.Payments;

namespace IA.MagicSuite.Web.Models.Payment
{
    public class CancelPaymentModel
    {
        public string PaymentId { get; set; }

        public SubscriptionPaymentGatewayType Gateway { get; set; }
    }
}