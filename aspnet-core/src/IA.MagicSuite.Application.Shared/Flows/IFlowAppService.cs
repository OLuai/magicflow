using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Flows.Dto;

namespace IA.MagicSuite.Flows
{
    public interface IFlowAppService : IApplicationService
    {
        ListResultDto<FlowsListDto> GetFlows(GetFlowsInput input);
        void SaveFlow(FlowDto input);
        FlowDto GetFlow(GetFlowInput input);
    }
}