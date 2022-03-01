using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicAppStatusAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicAppStatusForViewDto>> GetAll(GetAllMagicAppStatusInput input);

        Task<GetMagicAppStatusForViewDto> GetMagicAppStatusForView(long id);

		Task<GetMagicAppStatusForEditOutput> GetMagicAppStatusForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditMagicAppStatusDto input);

		Task Delete(EntityDto<long> input);
		
    }
}