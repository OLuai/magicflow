using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityRelationsAppService : IApplicationService 
    {
       
        Task<GetMagicEntityRelationForViewDto> GetMagicEntityRelationForView(string id);

		Task<GetMagicEntityRelationForEditOutput> GetMagicEntityRelationForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityRelationDto input);

		Task Delete(EntityDto<string> input);
		
				
    }
}