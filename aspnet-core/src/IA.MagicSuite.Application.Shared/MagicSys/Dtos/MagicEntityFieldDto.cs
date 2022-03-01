
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityFieldDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }


		public string DbFieldName { get; set; }

		public virtual string DisplayName { get; set; }
		
		public virtual string LocalizationName { get; set; }

		public string Regex { get; set; }

		public bool IsEntityKey { get; set; }

		public bool IsSearchable { get; set; }

		public bool ShowInAdvancedSearch { get; set; }

		public string Description { get; set; }

		public bool UseFieldSecurity { get; set; }
		public bool UseAutomaticFieldSecurityPermissionNaming { get; set; }
		public string ReadPermissionValue { get; set; }

		public string UpdatePermissionValue { get; set; }

		public string CreatePermissionValue { get; set; }

		public string CalculationFormula { get; set; }

		public bool ExludeFromTrackChangesHistory { get; set; }

		public string LinkedDirectSql { get; set; }

		public string EntityId { get; set; }

		public string DataTypeId { get; set; }


		public string RequirementId { get; set; }

		public string LinkedEntityId { get; set; }

		 		 public string LinkedEntityFieldName { get; set; }

		 		 public string LinkedEntityFieldDisplayName { get; set; }

		 		 public string CalculationTypeId { get; set; }

				public string FieldGroupId { get; set; }

		public  bool? ReadOnly { get; set; }

		public string DefaultValue { get; set; }
	}
}