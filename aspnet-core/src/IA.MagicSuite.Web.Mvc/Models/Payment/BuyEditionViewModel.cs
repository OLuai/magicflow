using System.Collections.Generic;
using IA.MagicSuite.Editions;
using IA.MagicSuite.Editions.Dto;
using IA.MagicSuite.MultiTenancy.Payments;
using IA.MagicSuite.MultiTenancy.Payments.Dto;

namespace IA.MagicSuite.Web.Models.Payment
{
    public class BuyEditionViewModel
    {
        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public decimal? AdditionalPrice { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}
