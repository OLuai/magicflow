using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppVersionHistoryItemCategoriesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppVersionHistoryItemCategoryForViewDto>> GetAll(GetAllMagicAppVersionHistoryItemCategoriesInput input);

        Task<GetMagicAppVersionHistoryItemCategoryForViewDto> GetMagicAppVersionHistoryItemCategoryForView(string id);

		Task<GetMagicAppVersionHistoryItemCategoryForEditOutput> GetMagicAppVersionHistoryItemCategoryForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicAppVersionHistoryItemCategoryDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicAppVersionHistoryItemCategoryApplicationLanguageLookupTableDto>> GetAllApplicationLanguageForLookupTable(GetAllForLookupTableInput input);
		
    }
}