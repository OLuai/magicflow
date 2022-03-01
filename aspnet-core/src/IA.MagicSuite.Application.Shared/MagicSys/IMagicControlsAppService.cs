using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicControlsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicControlForViewDto>> GetAll(GetAllMagicControlsInput input);

        Task<GetMagicControlForViewDto> GetMagicControlForView(string id);

		Task<GetMagicControlForEditOutput> GetMagicControlForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicControlDto input);

		Task Delete(EntityDto<string> input);

				
    }
}