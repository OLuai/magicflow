using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppAdditionnalElementsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppAdditionnalElementForViewDto>> GetAll(GetAllMagicAppAdditionnalElementsInput input);

        Task<GetMagicAppAdditionnalElementForViewDto> GetMagicAppAdditionnalElementForView(string id);

		Task<GetMagicAppAdditionnalElementForEditOutput> GetMagicAppAdditionnalElementForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicAppAdditionnalElementDto input);

		Task Delete(EntityDto<string> input);

		
		Task<PagedResultDto<MagicAppAdditionnalElementMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
    }
}