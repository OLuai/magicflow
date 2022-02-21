using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityFields")]
    [Audited]
    public class MagicEntityField : FullAuditedEntity<string> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxDbFieldNameLength)]
		public virtual string DbFieldName { get; set; }

		
		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public virtual string DisplayName { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public virtual string LocalizationName { get; set; }


		[StringLength(MagicEntityFieldConsts.MaxRegexLength)]
		public virtual string Regex { get; set; }
		
		public virtual bool IsEntityKey { get; set; }
		
		public virtual bool IsSearchable { get; set; }
		
		public virtual bool ShowInAdvancedSearch { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }

		public virtual bool? ReadOnly { get; set; }

		public virtual string DefaultValue { get; set; }
		public virtual string FieldGroupId { get; set; }
		[ForeignKey("FieldGroupId")]
		public MagicEntityFieldGroup MagicEntityFieldGroupFk { get; set; }

		public virtual string DataTypeId { get; set; }

		[ForeignKey("DataTypeId")]
		public MagicEntityFieldDataType EntityFieldDataTypeFk { get; set; }

		public virtual string RequirementId { get; set; }

		[ForeignKey("RequirementId")]
		public MagicEntityFieldRequirement MagicEntityFieldRequirementFk { get; set; }


		public virtual bool UseFieldSecurity { get; set; }
		
		public virtual bool UseAutomaticFieldSecurityPermissionNaming { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxReadPermissionValueLength)]
		public virtual string ReadPermissionValue { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxUpdatePermissionValueLength)]
		public virtual string UpdatePermissionValue { get; set; }
		
		[StringLength(MagicEntityFieldConsts.MaxCreatePermissionValueLength)]
		public virtual string CreatePermissionValue { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string CalculationFormula { get; set; }
		
		public virtual bool ExludeFromTrackChangesHistory { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string LinkedDirectSql { get; set; }
		

		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }
		
		
		public virtual string LinkedEntityId { get; set; }
		
        [ForeignKey("LinkedEntityId")]
		public MagicEntity LinkedEntityFk { get; set; }
		
		public virtual string LinkedEntityFieldName { get; set; }
		
        [ForeignKey("LinkedEntityFieldName")]
		public MagicEntityField LinkedEntityFieldNameFk { get; set; }
		
		public virtual string LinkedEntityFieldDisplayName { get; set; }
		
        [ForeignKey("LinkedEntityFieldDisplayName")]
		public MagicEntityField LinkedEntityFieldDisplayNameFk { get; set; }
		
		public virtual string CalculationTypeId { get; set; }
		
        [ForeignKey("CalculationTypeId")]
		public MagicEntityFieldCalculationType CalculationTypeFk { get; set; }

		
		
    }
}