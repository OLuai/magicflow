using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.Flows.Dto
{
    public class SaveFlowInput: FullAuditedEntity<string>
    {
        [Required]
        public string FlowJSON { set; get; }
    }
}
