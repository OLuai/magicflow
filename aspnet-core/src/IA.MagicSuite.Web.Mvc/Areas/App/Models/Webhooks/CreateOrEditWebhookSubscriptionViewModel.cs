using Abp.Application.Services.Dto;
using Abp.Webhooks;
using IA.MagicSuite.WebHooks.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Webhooks
{
    public class CreateOrEditWebhookSubscriptionViewModel
    {
        public WebhookSubscription WebhookSubscription { get; set; }

        public ListResultDto<GetAllAvailableWebhooksOutput> AvailableWebhookEvents { get; set; }
    }
}
