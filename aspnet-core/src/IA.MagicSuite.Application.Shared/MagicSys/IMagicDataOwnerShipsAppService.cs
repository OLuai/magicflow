using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicDataOwnerShipsAppService : IApplicationService 
    {
        Task<PagedResultDto<GetMagicDataOwnerShipForViewDto>> GetAll(GetAllMagicDataOwnerShipsInput input);

        Task<GetMagicDataOwnerShipForViewDto> GetMagicDataOwnerShipForView(string id);

		Task<GetMagicDataOwnerShipForEditOutput> GetMagicDataOwnerShipForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicDataOwnerShipDto input);

		Task Delete(EntityDto<string> input);

    }
}