using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicSolutionConnectionsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicSolutionConnectionForViewDto>> GetAll(GetAllMagicSolutionConnectionsInput input);

        Task<GetMagicSolutionConnectionForViewDto> GetMagicSolutionConnectionForView(string id);

		Task<GetMagicSolutionConnectionForEditOutput> GetMagicSolutionConnectionForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicSolutionConnectionDto input);

		Task Delete(EntityDto<string> input);

				
		Task<PagedResultDto<MagicSolutionConnectionMagicSolutionLookupTableDto>> GetAllMagicSolutionForLookupTable(GetAllForLookupTableInput input);
		
    }
}