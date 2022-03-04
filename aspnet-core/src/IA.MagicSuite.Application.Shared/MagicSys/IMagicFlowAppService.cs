using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.MagicSuite.MagicSys
{
    public interface IMagicFlowAppService : IApplicationService
    {
        ListResultDto<ListMagicFlowsDto> GetMagicFlows(GetMagicFlowsInput input);
        void SaveMagicFlow(MagicFlowDto input);
        MagicFlowDto GetMagicFlow(GetOrDeleteMagicFlowInput input);

        void CreateOrEditMagicFlow(ListMagicFlowsDto input);

        void DeleteMagicFlow(GetOrDeleteMagicFlowInput input);
    }
}
