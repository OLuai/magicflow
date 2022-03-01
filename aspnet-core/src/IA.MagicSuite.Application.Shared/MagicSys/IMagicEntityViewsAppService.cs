using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityViewsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityViewForViewDto>> GetAll(GetAllMagicEntityViewsInput input);

		Task<ListResultDto<GetMagicEntityViewForViewDto>> GetEntityViews(string id);

		Task<GetMagicEntityViewForViewDto> GetMagicEntityViewForView(string id);

		Task<GetMagicEntityViewForEditOutput> GetMagicEntityViewForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityViewDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicEntityViewMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicEntityViewMagicEntityViewTypeLookupTableDto>> GetAllMagicEntityViewTypeForTableDropdown();
		
    }
}