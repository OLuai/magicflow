using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicSolutionsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicSolutionForViewDto>> GetAll(GetAllMagicSolutionsInput input);

		Task<GetMagicSolutionForEditOutput> GetMagicSolutionForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicSolutionDto input);

		Task Delete(EntityDto<string> input);

				
		Task<PagedResultDto<MagicSolutionUserLookupTableDto>> GetAllUserForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicSolutionMagicVendorLookupTableDto>> GetAllMagicVendorForLookupTable(GetAllForLookupTableInput input);
		
    }
}