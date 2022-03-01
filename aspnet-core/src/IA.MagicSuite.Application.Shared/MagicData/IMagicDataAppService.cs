using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Dto;
using System.Collections.Generic;
using IA.MagicSuite.MagicData.Dtos;
using System.Dynamic;

namespace IA.MagicSuite.MagicData
{
    public interface IMagicDataAppService : IApplicationService 
    {
        Task<MagicDataObjectResult> Get(GetMagicDataInput input);

        Task<List<MagicDataObjectResult>> GetEntities(GetEntitiesMagicDataInput input);

        Task<MagicDataObjectResult> GetEntitySourceColumnsInfo(GetEntitySourceColumnsInfoMagicDataInput input);
        Task<MagicDataObjectResult> CreateOrEdit(CreateOrEditMagicDataInput input);

        Task<MagicDataObjectResult> Create(CreateOrEditMagicDataInput input);

        Task<MagicDataObjectResult> Update(CreateOrEditMagicDataInput input);
        
        Task Delete(DeleteMagicDataInput input);
        		
		
    }
}