using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.Configuration.Host.Dto;

namespace IA.MagicSuite.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
