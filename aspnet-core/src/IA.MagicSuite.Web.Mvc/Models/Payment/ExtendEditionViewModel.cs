using System.Collections.Generic;
using IA.MagicSuite.Editions.Dto;
using IA.MagicSuite.MultiTenancy.Payments;

namespace IA.MagicSuite.Web.Models.Payment
{
    public class ExtendEditionViewModel
    {
        public EditionSelectDto Edition { get; set; }

        public List<PaymentGatewayModel> PaymentGateways { get; set; }
    }
}