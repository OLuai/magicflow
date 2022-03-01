using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.BackgroundJobs;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using IA.MagicSuite.Authorization;
using IA.MagicSuite.Editions.Dto;
using IA.MagicSuite.MultiTenancy;
using IA.MagicSuite.MagicSys;
using IA.MagicSuite.EntityFrameworkCore;
using IA.MagicSuite.Flows.Dto;

namespace IA.MagicSuite.Flows
{
    public class FlowAppService : MagicSuiteAppServiceBase, IFlowAppService
    {

        private readonly IRepository<MagicFlow, string> _flowRepository;


        public FlowAppService(IRepository<MagicFlow, string> flowRepository)
        
        {

            _flowRepository = flowRepository;
        }

        public FlowDto GetFlow(GetFlowInput input)
        {
            var flow = _flowRepository.Get(input.Id);
            var result = ObjectMapper.Map<FlowDto>(flow);

            return result;
        }

        public ListResultDto<FlowsListDto> GetFlows(GetFlowsInput input)
        {

            var flows = _flowRepository.GetAllList().ToList();
            return new ListResultDto<FlowsListDto>(ObjectMapper.Map<List<FlowsListDto>>(flows));
        }

        public void SaveFlow(FlowDto input)
        {
            var flow = _flowRepository.Get(input.Id);
            flow.FlowJSON = input.FlowJSON;
            flow.Name = input.Name;
            _flowRepository.Update(flow);
        }
    }
}
