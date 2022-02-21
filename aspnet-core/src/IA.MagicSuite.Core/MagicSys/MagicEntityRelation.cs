using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_MagicEntityRelations")]
    [Audited]
    public class MagicEntityRelation : FullAuditedEntity<string> , IMayHaveTenant
    {
		public int? TenantId { get; set; }

		[Required]
		public virtual string Name { get; set; }
						
		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public virtual string DisplayName { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public virtual string LocalizationName { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }

		public virtual bool? IsActive { get; set; }

		[Required]
		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }
		public virtual string EntityFieldName { get; set; }

		[Required]
		public virtual string ChildEntityId { get; set; }
		
        [ForeignKey("ChildEntityId")]
		public MagicEntity ChildEntityFk { get; set; }

		[Required]
		public virtual string ChildEntityFieldName { get; set; }	
       				
		
    }
}