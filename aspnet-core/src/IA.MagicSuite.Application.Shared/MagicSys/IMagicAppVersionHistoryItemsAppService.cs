using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppVersionHistoryItemsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppVersionHistoryItemForViewDto>> GetAll(GetAllMagicAppVersionHistoryItemsInput input);

        Task<GetMagicAppVersionHistoryItemForViewDto> GetMagicAppVersionHistoryItemForView(long id);

		Task<GetMagicAppVersionHistoryItemForEditOutput> GetMagicAppVersionHistoryItemForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditMagicAppVersionHistoryItemDto input);

		Task Delete(EntityDto<long> input);

		
		Task<PagedResultDto<MagicAppVersionHistoryItemMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppVersionHistoryItemMagicAppVersionHistoryLookupTableDto>> GetAllMagicAppVersionHistoryForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicAppVersionHistoryItemMagicAppVersionHistoryItemCategoryLookupTableDto>> GetAllMagicAppVersionHistoryItemCategoryForTableDropdown();
		
    }
}