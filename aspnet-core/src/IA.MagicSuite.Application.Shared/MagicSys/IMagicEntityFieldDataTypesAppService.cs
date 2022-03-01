using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityFieldDataTypesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityFieldDataTypeForViewDto>> GetAll(GetAllMagicEntityFieldDataTypesInput input);

        Task<GetMagicEntityFieldDataTypeForViewDto> GetMagicEntityFieldDataTypeForView(string id);

		Task<GetMagicEntityFieldDataTypeForEditOutput> GetMagicEntityFieldDataTypeForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityFieldDataTypeDto input);

		Task Delete(EntityDto<string> input);

    }
}