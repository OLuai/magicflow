using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntitiesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityForViewDto>> GetAll(GetAllMagicEntitiesInput input);

        Task<GetMagicEntityForViewDto> GetMagicEntityForView(string id);

		Task<GetMagicEntityForEditOutput> GetMagicEntityForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicEntityMagicSolutionLookupTableDto>> GetAllMagicSolutionForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicEntityMagicDataOwnerShipLookupTableDto>> GetAllMagicDataOwnerShipForTableDropdown();
		
		Task<PagedResultDto<MagicEntityMagicPageLookupTableDto>> GetAllMagicPageForLookupTable(GetAllForLookupTableInput input);
		
    }
}