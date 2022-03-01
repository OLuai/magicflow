using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityViewTypesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityViewTypeForViewDto>> GetAll(GetAllMagicEntityViewTypesInput input);

        Task<GetMagicEntityViewTypeForViewDto> GetMagicEntityViewTypeForView(string id);

		Task<GetMagicEntityViewTypeForEditOutput> GetMagicEntityViewTypeForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityViewTypeDto input);

		Task Delete(EntityDto<string> input);

		
    }
}