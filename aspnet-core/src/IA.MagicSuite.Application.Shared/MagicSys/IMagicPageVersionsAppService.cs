using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicPageVersionsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicPageVersionForViewDto>> GetAll(GetAllMagicPageVersionsInput input);

        Task<GetMagicPageVersionForViewDto> GetMagicPageVersionForView(long id);

		Task<GetMagicPageVersionForEditOutput> GetMagicPageVersionForEdit(EntityDto<long> input);

		Task<MagicPageVersionDto> CreateOrEdit(CreateOrEditMagicPageVersionDto input);

		Task Delete(EntityDto<long> input);

		Task<PagedResultDto<MagicPageVersionMagicPageLookupTableDto>> GetAllMagicPageForLookupTable(GetAllForLookupTableInput input);
		
    }
}