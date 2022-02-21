using IA.MagicSuite.Editions;
using IA.MagicSuite.Editions.Dto;
using IA.MagicSuite.MultiTenancy.Payments;
using IA.MagicSuite.Security;
using IA.MagicSuite.MultiTenancy.Payments.Dto;

namespace IA.MagicSuite.Web.Models.TenantRegistration
{
    public class TenantRegisterViewModel
    {
        public PasswordComplexitySetting PasswordComplexitySetting { get; set; }

        public int? EditionId { get; set; }

        public SubscriptionStartType? SubscriptionStartType { get; set; }

        public EditionSelectDto Edition { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }
    }
}
