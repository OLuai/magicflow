
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityFieldDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public string Name { get; set; }
				
		[StringLength(MagicEntityFieldConsts.MaxDbFieldNameLength)]
		public string DbFieldName { get; set; }

		public string DisplayName { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public string LocalizationName { get; set; }


		[StringLength(MagicEntityFieldConsts.MaxRegexLength)]
		public string Regex { get; set; }
		
		
		public bool IsEntityKey { get; set; }
		public bool IsSearchable { get; set; }
		
		
		public bool ShowInAdvancedSearch { get; set; }
		
		
		[StringLength(MagicEntityFieldConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		public bool UseFieldSecurity { get; set; }
		
		
		public bool UseAutomaticFieldSecurityPermissionNaming { get; set; }
		
		
		[StringLength(MagicEntityFieldConsts.MaxReadPermissionValueLength)]
		public string ReadPermissionValue { get; set; }
		
		
		[StringLength(MagicEntityFieldConsts.MaxUpdatePermissionValueLength)]
		public string UpdatePermissionValue { get; set; }
		
		
		[StringLength(MagicEntityFieldConsts.MaxCreatePermissionValueLength)]
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

				public bool? ReadOnly { get; set; }

				public string DefaultValue { get; set; }
	}
}