using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using IA.MagicSuite.MagicSys.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IA.MagicSuite.MagicSys
{
    public class MagicFlowAppService : MagicSuiteAppServiceBase, IMagicFlowAppService
    {
        private readonly IRepository<MagicFlow, string> _flowRepository;


        public MagicFlowAppService(IRepository<MagicFlow, string> flowRepository)

        {

            _flowRepository = flowRepository;
        }
        public void CreateOrEditMagicFlow(ListMagicFlowsDto input)
        {
            MagicFlow flow;
            if (input.Id != null)
            {
                flow = _flowRepository.FirstOrDefault(input.Id);
                if (flow == null)
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

        public void DeleteMagicFlow(GetOrDeleteMagicFlowInput input)
        {
            _flowRepository.Delete(input.Id);
        }

        public MagicFlowDto GetMagicFlow(GetOrDeleteMagicFlowInput input)
        {
            var flow = _flowRepository.Get(input.Id);
            var result = ObjectMapper.Map<MagicFlowDto>(flow);

            return result;
        }

        public ListResultDto<ListMagicFlowsDto> GetMagicFlows(GetMagicFlowsInput input)
        {
            var flows = _flowRepository.GetAllList().ToList();
            return new ListResultDto<ListMagicFlowsDto>(ObjectMapper.Map<List<ListMagicFlowsDto>>(flows));
        }

        public void SaveMagicFlow(MagicFlowDto input)
        {
            var flow = _flowRepository.Get(input.Id);
            if (flow != null)
            {
                flow.FlowJSON = input.FlowJSON;
                flow.Name = input.Name;
                _flowRepository.Update(flow);
            }
        }
    }
}
