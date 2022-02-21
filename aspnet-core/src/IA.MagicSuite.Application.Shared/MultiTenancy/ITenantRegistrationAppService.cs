using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.Editions.Dto;
using IA.MagicSuite.MultiTenancy.Dto;

namespace IA.MagicSuite.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}