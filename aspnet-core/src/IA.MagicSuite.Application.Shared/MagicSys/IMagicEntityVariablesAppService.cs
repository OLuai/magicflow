using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Dto;
using System.Collections.Generic;


namespace IA.MagicSuite.MagicSys
{
    public interface IMagicEntityVariablesAppService : IApplicationService 
    {
        
		Task<ListResultDto<GetMagicEntityVariableForViewDto>> GetEntityVariables(string id);

		Task<GetMagicEntityVariableForViewDto> GetForView(string id);

		Task<GetMagicEntityVariableForEditOutput> GetForEdit(EntityDto<string> input);

		Task CreateOrEdit(CreateOrEditMagicEntityVariableDto input);

		Task Delete(EntityDto<string> input);
		
		
    }
}