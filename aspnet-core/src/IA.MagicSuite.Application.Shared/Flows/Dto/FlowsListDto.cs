using Abp.Application.Services.Dto;
namespace IA.MagicSuite.Flows
{
   
    public class GetFlowsInput
    {
        public string Filter { get; set; }
    }
    public class FlowsListDto : FullAuditedEntityDto<string>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string FlowJSON { get; set; }
    }
}