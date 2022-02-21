using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityFieldRequirements")]
    public class MagicEntityFieldRequirement : Entity<string> 
    {

		[Required]
		[StringLength(MagicEntityFieldRequirementConsts.MaxNameLength, MinimumLength = MagicEntityFieldRequirementConsts.MinNameLength)]
		public virtual string Name { get; set; }
		

    }
}