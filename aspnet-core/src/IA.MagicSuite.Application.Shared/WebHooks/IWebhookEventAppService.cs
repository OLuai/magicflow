using System.Threading.Tasks;
using Abp.Webhooks;

namespace IA.MagicSuite.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
