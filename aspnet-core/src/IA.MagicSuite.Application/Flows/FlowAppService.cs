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

namespace IA.MagicSuite.Flows
{
    public class FlowAppService : MagicSuiteAppServiceBase, IFlowAppService
    {

        private readonly IRepository<MagicFlow, string> _flowRepository;


        public FlowAppService(
            IRepository<MagicFlow, string> flowRepository
            )
        
        {

            _flowRepository = flowRepository;
        }

        public ListResultDto<FlowsListDto> GetFlows(GetFlowsInput input)
        {

            var flows = _flowRepository.GetAllList().ToList();
            //var result = new List<FlowsListDto>();
            //foreach (var flow in flows)
            //{
            //    var resultFlow = ObjectMapper.Map<FlowsListDto>(flow);

            //    result.Add(resultFlow);
            //}

            //return new ListResultDto<FlowsListDto>(result);
            return new ListResultDto<FlowsListDto>(ObjectMapper.Map<List<FlowsListDto>>(flows));
        }

        public async Task<int> GetLuaiAge()
        {
            return await _flowRepository.CountAsync(t => t.Id == "luai-a-fait-test");
        }
    }
}
