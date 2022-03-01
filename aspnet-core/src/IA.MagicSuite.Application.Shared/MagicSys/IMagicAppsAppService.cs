using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppForViewDto>> GetAll(GetAllMagicAppsInput input);

        Task<GetMagicAppForViewDto> GetMagicAppForView(string id);

		Task<GetMagicAppForEditOutput> GetMagicAppForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicAppDto input);

		Task Delete(EntityDto<string> input);
						
		Task<PagedResultDto<MagicAppMagicSolutionLookupTableDto>> GetAllMagicSolutionForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicAppMagicAppTypeLookupTableDto>> GetAllMagicAppTypeForTableDropdown();
		
		Task<PagedResultDto<MagicAppMagicAppStatusLookupTableDto>> GetAllMagicAppStatusForLookupTable(GetAllForLookupTableInput input);
		
    }
}