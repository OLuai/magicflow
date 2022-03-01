using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityFieldCalculationTypesAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicEntityFieldCalculationTypeForViewDto>> GetAll(GetAllMagicEntityFieldCalculationTypesInput input);

        Task<GetMagicEntityFieldCalculationTypeForViewDto> GetMagicEntityFieldCalculationTypeForView(string id);

		Task<GetMagicEntityFieldCalculationTypeForEditOutput> GetMagicEntityFieldCalculationTypeForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityFieldCalculationTypeDto input);

		Task Delete(EntityDto<string> input);

		
    }
}