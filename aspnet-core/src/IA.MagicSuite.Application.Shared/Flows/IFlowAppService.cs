using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.Flows
{
    public interface IFlowAppService : IApplicationService
    {
        Task<int> GetLuaiAge();
        ListResultDto<FlowsListDto> GetFlows(GetFlowsInput input);
    }
}