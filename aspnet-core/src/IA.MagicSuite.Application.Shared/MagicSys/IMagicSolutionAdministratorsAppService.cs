using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicSolutionAdministratorsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicSolutionAdministratorForViewDto>> GetAll(GetAllMagicSolutionAdministratorsInput input);

        Task<GetMagicSolutionAdministratorForViewDto> GetMagicSolutionAdministratorForView(long id);

		Task<GetMagicSolutionAdministratorForEditOutput> GetMagicSolutionAdministratorForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditMagicSolutionAdministratorDto input);

		Task Delete(EntityDto<long> input);

		
		Task<PagedResultDto<MagicSolutionAdministratorUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicSolutionAdministratorMagicSolutionLookupTableDto>> GetAllMagicSolutionForLookupTable(GetAllForLookupTableInput input);
		
    }
}