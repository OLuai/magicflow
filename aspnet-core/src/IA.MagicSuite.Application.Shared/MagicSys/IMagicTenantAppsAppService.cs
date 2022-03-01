using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicTenantAppsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicTenantAppForViewDto>> GetAll(GetAllMagicTenantAppsInput input);

        Task<GetMagicTenantAppForViewDto> GetMagicTenantAppForView(long id);

		Task<GetMagicTenantAppForEditOutput> GetMagicTenantAppForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditMagicTenantAppDto input);

		Task Delete(EntityDto<long> input);

		Task<PagedResultDto<MagicTenantAppMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
    }
}