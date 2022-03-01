using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityFieldsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityFieldForViewDto>> GetAll(GetAllMagicEntityFieldsInput input);

        Task<GetMagicEntityFieldForViewDto> GetMagicEntityFieldForView(string id);

		Task<GetMagicEntityFieldForEditOutput> GetMagicEntityFieldForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityFieldDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicEntityFieldMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicEntityFieldMagicEntityFieldDataTypeLookupTableDto>> GetAllMagicEntityFieldDataTypeForTableDropdown();
		
		Task<List<MagicEntityFieldMagicEntityFieldRequirementLookupTableDto>> GetAllMagicEntityFieldRequirementForTableDropdown();
		
		Task<PagedResultDto<MagicEntityFieldMagicEntityFieldLookupTableDto>> GetAllMagicEntityFieldForLookupTable(GetAllForLookupTableInput input);
		
		Task<List<MagicEntityFieldMagicEntityFieldCalculationTypeLookupTableDto>> GetAllMagicEntityFieldCalculationTypeForTableDropdown();
		
		Task<PagedResultDto<MagicEntityFieldMagicEntityFieldGroupLookupTableDto>> GetAllMagicEntityFieldGroupForLookupTable(GetAllForLookupTableInput input);
		
    }
}