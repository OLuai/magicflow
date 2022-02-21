using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_FlowExecutionStatus")]
    public class MagicFlowExecutionStatus : Entity<string> 
    {

		[Required]
		[StringLength(MagicPageTypeConsts.MaxNameLength)]
		public virtual string Name { get; set; }

		[StringLength(400)]
		public virtual string Description { get; set; }

		[StringLength(MagicPageTypeConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }		

    }
}