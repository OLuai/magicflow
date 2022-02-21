using IA.MagicSuite.Editions.Dto;

namespace IA.MagicSuite.MultiTenancy.Payments.Dto
{
    public class PaymentInfoDto
    {
        public EditionSelectDto Edition { get; set; }

        public decimal AdditionalPrice { get; set; }

        public bool IsLessThanMinimumUpgradePaymentAmount()
        {
            return AdditionalPrice < MagicSuiteConsts.MinimumUpgradePaymentAmount;
        }
    }
}
