using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicEntityFieldsForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DbFieldNameFilter { get; set; }

		public string RegexFilter { get; set; }

		public int? IsSearchableFilter { get; set; }

		public int? ShowInAdvancedSearchFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public int? UseFieldSecurityFilter { get; set; }

		public string UpdatePermissionValueFilter { get; set; }

		public string CreatePermissionValueFilter { get; set; }

		public string CalculationFormulaFilter { get; set; }

		public int? ExludeFromTrackChangesHistoryFilter { get; set; }


		 public string MagicEntityNameFilter { get; set; }

		 		 public string MagicEntityFieldDataTypeNameFilter { get; set; }

		 		 public string MagicEntityFieldRequirementNameFilter { get; set; }

		 		 public string MagicEntityName2Filter { get; set; }

		 		 public string MagicEntityFieldNameFilter { get; set; }

		 		 public string MagicEntityFieldName2Filter { get; set; }

		 		 public string MagicEntityFieldCalculationTypeNameFilter { get; set; }

		 		 public string MagicEntityFieldGroupNameFilter { get; set; }

		 
    }
}