using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.Flows.Dto
{
    public class GetFlowInput: FullAuditedEntity<string> { }
    public class FlowDto : FullAuditedEntity<string>
    {
        public FlowDto(){
            FlowJSON = "[]";
        }
        [Required]
        public string Name { get; set; }

        [StringLength(int.MaxValue)]
        public string FlowJSON { get; set; }
    }
}
