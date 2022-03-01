using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppVersionHistoriesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppVersionHistoryForViewDto>> GetAll(GetAllMagicAppVersionHistoriesInput input);

        Task<GetMagicAppVersionHistoryForViewDto> GetMagicAppVersionHistoryForView(long id);

		Task<GetMagicAppVersionHistoryForEditOutput> GetMagicAppVersionHistoryForEdit(EntityDto<long> input);

		Task<GetMagicAppVersionHistoryForEditOutput> GetMagicAppVersionHistoryByAppIdAndVersionName(GetMagicAppVersionHistoryByAppIdAndVersionNameInput input);

		Task<GetMagicAppVersionHistoryForEditOutput> CreateOrEdit(CreateOrEditMagicAppVersionHistoryDto input);

		Task Delete(EntityDto<long> input);

		
		Task<PagedResultDto<MagicAppVersionHistoryMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
    }
}