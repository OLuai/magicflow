using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using IA.MagicSuite.MagicSys.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Extensions;
using Microsoft.EntityFrameworkCore;

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


            var flows = _flowRepository
                .GetAll()
                .Include(flow => flow.MagicFlowTypeFk)
                .WhereIf(input != null,
                    flow => {

                        bool checkFilter = input.Filter.IsNullOrEmpty() || flow.Name.ToLower().Contains(input.Filter.ToLower()) || (!flow.Description.IsNullOrEmpty() && flow.Description.ToLower().Contains(input.Filter.ToLower())) || (flow.MagicFlowTypeFk != null && flow.MagicFlowTypeFk.Name.ToLower().Contains(input.Filter.ToLower()));
                        bool checkName = input.NameFilter.IsNullOrEmpty() || flow.Name.ToLower().Contains(input.NameFilter.ToLower());
                        bool checkDescription = input.DescriptionFilter.IsNullOrEmpty() || (!flow.Description.IsNullOrEmpty() && flow.Description.ToLower().Contains(input.DescriptionFilter.ToLower()));
                        bool checkActive = input.IsActiveFilter.IsNullOrEmpty() || flow.IsActive.Equals(input.IsActiveFilter == "0");
                        bool checkFlowType = input.FlowTypeFilter.IsNullOrEmpty() || (flow.MagicFlowTypeFk != null && flow.MagicFlowTypeFk.Id.Equals(input.FlowTypeFilter));
                        return checkFilter && checkName && checkDescription && checkFlowType && checkActive;
                    }
                )
                .OrderBy(flow => flow.Name)
                .ToList();
            dynamic result = new ListResultDto<ListMagicFlowsDto>(ObjectMapper.Map<List<ListMagicFlowsDto>>(flows));

            return result;
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
 //|| flow.MagicEntityFk.Name.Contains(input.Filter)