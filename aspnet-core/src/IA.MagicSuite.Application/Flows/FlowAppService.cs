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

        public void CreateOrEditFlow(ListFlowDto input)
        {
            MagicFlow flow;
            if(input.Id != null)
            {
                flow = _flowRepository.FirstOrDefault(input.Id);
                if(flow == null)
                {
                    flow = ObjectMapper.Map<MagicFlow>(input);
                    _flowRepository.Insert(flow);
                }
                else
                {
                    flow.Name = input.Name;
                    flow.Description = input.Description;
                    flow.FlowTypeId = input.FlowTypeId;
                    flow.IsActive = input.IsActive;
                    //TO DO
                    _flowRepository.Update(flow);   
                }
               
            }
        }

        public FlowDto GetFlow(GetFlowInput input)
        {
            var flow = _flowRepository.Get(input.Id);
            var result = ObjectMapper.Map<FlowDto>(flow);

            return result;
        }

        public ListResultDto<ListFlowDto> GetFlows(GetFlowsInput input)
        {

            var flows = _flowRepository.GetAllList().ToList();
            return new ListResultDto<ListFlowDto>(ObjectMapper.Map<List<ListFlowDto>>(flows));
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
