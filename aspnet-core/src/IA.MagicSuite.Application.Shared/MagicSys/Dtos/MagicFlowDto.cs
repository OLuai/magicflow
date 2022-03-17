using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetOrDeleteMagicFlowInput : EntityDto<string> { }


    public class MagicFlowDto : EntityDto<string>
    {
        [Required]
        public string Name { get; set; }

        [StringLength(int.MaxValue)]
        public string FlowJSON { get; set; }
    }


    public class GetMagicFlowsInput
    {
        public string Filter { set; get; }
        public string NameFilter { set; get; }
        public string DescriptionFilter { set; get; }
        public string FlowTypeFilter { get; set; }
        public string IsActiveFilter { get; set; }
    }


    public class ListMagicFlowsDto : EntityDto<string>, IPassivable
    {
        [Required]
        [StringLength(150)]
        public string Name { set; get; }

        [StringLength(400)]
        public string Description { get; set; }

        public string FlowTypeId { get; set; } //Le type du flow pour filtrer les différents type d'actions disponibles APPROVAL,UI,STANDARD
        public string MagicFlowType { get; set; }
        public bool IsActive { get; set; }
        public virtual string SolutionId { get; set; }
    }
}
