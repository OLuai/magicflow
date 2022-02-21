using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.Configuration.Tenants.Dto;

namespace IA.MagicSuite.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
