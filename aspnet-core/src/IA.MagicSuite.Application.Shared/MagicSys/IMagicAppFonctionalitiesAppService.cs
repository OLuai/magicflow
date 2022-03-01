using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppFonctionalitiesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppFonctionalityForViewDto>> GetAll(GetAllMagicAppFonctionalitiesInput input);

        Task<GetMagicAppFonctionalityForViewDto> GetMagicAppFonctionalityForView(long id);

		Task<GetMagicAppFonctionalityForEditOutput> GetMagicAppFonctionalityForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditMagicAppFonctionalityDto input);

		Task Delete(EntityDto<long> input);

		
		Task<PagedResultDto<MagicAppFonctionalityMagicAppFonctionalityCategoryLookupTableDto>> GetAllMagicAppFonctionalityCategoryForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppFonctionalityMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppFonctionalityUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);
		
    }
}