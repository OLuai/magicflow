using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.Web.Models.Account
{
    public class SendPasswordResetLinkViewModel
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}