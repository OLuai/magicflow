using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityFieldCalculationTypes")]
    public class MagicEntityFieldCalculationType : Entity<string> 
    {

		[Required]
		[StringLength(MagicEntityFieldCalculationTypeConsts.MaxNameLength, MinimumLength = MagicEntityFieldCalculationTypeConsts.MinNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicEntityFieldCalculationTypeConsts.MaxDescriptionLength, MinimumLength = MagicEntityFieldCalculationTypeConsts.MinDescriptionLength)]
		public virtual string Description { get; set; }
		

    }
}