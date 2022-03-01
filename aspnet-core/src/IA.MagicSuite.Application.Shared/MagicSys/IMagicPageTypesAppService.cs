using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicPageTypesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicPageTypeForViewDto>> GetAll(GetAllMagicPageTypesInput input);

        Task<GetMagicPageTypeForViewDto> GetMagicPageTypeForView(string id);

		Task<GetMagicPageTypeForEditOutput> GetMagicPageTypeForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicPageTypeDto input);

		Task Delete(EntityDto<string> input);

		
    }
}