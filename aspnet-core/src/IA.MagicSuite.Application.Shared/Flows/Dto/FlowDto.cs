using Abp.Application.Services.Dto;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.Flows.Dto
{
    public class GetOrDeleteFlowInput: EntityDto<string> { }
    public class FlowDto : EntityDto<string>
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
