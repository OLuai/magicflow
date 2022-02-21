using IA.MagicSuite.Dto;

namespace IA.MagicSuite.WebHooks.Dto
{
    public class GetAllSendAttemptsInput : PagedInputDto
    {
        public string SubscriptionId { get; set; }
    }
}
