using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;

namespace IA.MagicSuite.MagicSys
{
    public interface IMagicPagesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicPageForViewDto>> GetAll(GetAllMagicPagesInput input);

		Task<ListResultDto<GetMagicPageForViewDto>> GetEntityPages(string input);

		Task<GetMagicPageForViewDto> GetMagicPageForView(string id);

		Task<GetMagicPageForEditOutput> GetMagicPageForEdit(EntityDto<string> input);

		Task<MagicPageDto> CreateOrEdit(CreateOrEditMagicPageDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicPageMagicSolutionLookupTableDto>> GetAllMagicSolutionForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicPageMagicPageTypeLookupTableDto>> GetAllMagicPageTypeForTableDropdown();
		
		Task<PagedResultDto<MagicPageMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
    }
}