using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppTypesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppTypeForViewDto>> GetAll(GetAllMagicAppTypesInput input);

        Task<GetMagicAppTypeForViewDto> GetMagicAppTypeForView(string id);

		Task<GetMagicAppTypeForEditOutput> GetMagicAppTypeForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicAppTypeDto input);

		Task Delete(EntityDto<string> input);

	
    }
}