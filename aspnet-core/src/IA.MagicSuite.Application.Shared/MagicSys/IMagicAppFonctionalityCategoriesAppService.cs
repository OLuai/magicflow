using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppFonctionalityCategoriesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppFonctionalityCategoryForViewDto>> GetAll(GetAllMagicAppFonctionalityCategoriesInput input);

        Task<GetMagicAppFonctionalityCategoryForViewDto> GetMagicAppFonctionalityCategoryForView(string id);

		Task<GetMagicAppFonctionalityCategoryForEditOutput> GetMagicAppFonctionalityCategoryForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicAppFonctionalityCategoryDto input);

		Task Delete(EntityDto<string> input);

		Task<PagedResultDto<MagicAppFonctionalityCategoryMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
    }
}