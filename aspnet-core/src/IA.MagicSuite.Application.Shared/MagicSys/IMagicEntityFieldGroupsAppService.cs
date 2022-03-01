using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityFieldGroupsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityFieldGroupForViewDto>> GetAll(GetAllMagicEntityFieldGroupsInput input);

        Task<GetMagicEntityFieldGroupForViewDto> GetMagicEntityFieldGroupForView(string id);

		Task<GetMagicEntityFieldGroupForEditOutput> GetMagicEntityFieldGroupForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityFieldGroupDto input);

		Task Delete(EntityDto<string> input);

				Task<PagedResultDto<MagicEntityFieldGroupMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
    }
}