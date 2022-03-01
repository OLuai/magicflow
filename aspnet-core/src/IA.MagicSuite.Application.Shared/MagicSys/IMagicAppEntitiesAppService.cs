using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppEntitiesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppEntityForViewDto>> GetAll(GetAllMagicAppEntitiesInput input);

		Task<GetMagicAppEntityForEditOutput> GetAppEntityForEdit(EntityDto<long> input);

		Task<GetMagicAppEntityForEditOutput> CreateOrEdit(CreateOrEditMagicAppEntityDto input);

		Task Delete(EntityDto<long> input);

	
		Task<PagedResultDto<MagicAppEntityMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppEntityMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
    }
}