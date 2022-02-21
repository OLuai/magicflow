using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}