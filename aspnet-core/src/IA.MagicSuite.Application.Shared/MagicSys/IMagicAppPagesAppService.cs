using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppPagesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppPageForViewDto>> GetAll(GetAllMagicAppPagesInput input);

        Task<GetMagicAppPageForViewDto> GetMagicAppPageForView(long id);

		Task<GetMagicAppPageForEditOutput> GetMagicAppPageForEdit(EntityDto<long> input);

		Task<GetMagicAppPageForViewDto> CreateOrEdit(CreateOrEditMagicAppPageDto input);

		Task<ListResultDto<GetMagicAppPageForViewDto>> GetAppPagesByAppId(string input);

		Task<GetMagicAppPageForViewDto> CreatePageFirstAndLinkToApp(CreateOrEditMagicAppPageAndPageDto input);

		Task Delete(EntityDto<long> input);

		Task<PagedResultDto<MagicAppPageMagicAppLookupTableDto>> GetAllMagicAppForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppPageMagicEntityLookupTableDto>> GetAllMagicEntityForLookupTable(GetAllForLookupTableInput input);
		
		Task<PagedResultDto<MagicAppPageMagicPageLookupTableDto>> GetAllMagicPageForLookupTable(GetAllForLookupTableInput input);
		
    }
}