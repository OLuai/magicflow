using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityFieldGroups")]
    [Audited]
    public class MagicEntityFieldGroup : FullAuditedEntity<string> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public virtual string Name { get; set; }

		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public virtual string DisplayName { get; set; }

		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public virtual string LocalizationName { get; set; }


		[StringLength(MagicEntityFieldGroupConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[StringLength(MagicEntityFieldGroupConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicEntityFieldGroupConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		

		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }
		
    }
}