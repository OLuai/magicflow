using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace IA.MagicSuite.Flows.Dto
{
    public class CreateOrEditFlowDto: EntityDto<string>, IMayHaveTenant, IPassivable
    {
        [Required]
        [StringLength(150)]
        public string Name { set; get; }

        [StringLength(400)]
        public virtual string Description { get; set; }

        public virtual string FlowTypeId { get; set; } //Le type du flow pour filtrer les différents type d'actions disponibles APPROVAL,UI,STANDARD
        public bool IsActive { get; set; }
        public int? TenantId { get; set; }
    }
}
