using System.Threading.Tasks;
using IA.MagicSuite.Authorization.Users;

namespace IA.MagicSuite.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
