using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityFieldRequirementsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityFieldRequirementForViewDto>> GetAll(GetAllMagicEntityFieldRequirementsInput input);

        Task<GetMagicEntityFieldRequirementForViewDto> GetMagicEntityFieldRequirementForView(string id);

		Task<GetMagicEntityFieldRequirementForEditOutput> GetMagicEntityFieldRequirementForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityFieldRequirementDto input);

		Task Delete(EntityDto<string> input);
		
    }
}