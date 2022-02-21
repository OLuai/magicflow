using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityViewTypes")]
    public class MagicEntityViewType : FullAuditedEntity<string> 
    {

		[Required]
		[StringLength(MagicEntityViewTypeConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		[StringLength(MagicEntityViewTypeConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[StringLength(MagicEntityViewTypeConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicEntityViewTypeConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		

    }
}