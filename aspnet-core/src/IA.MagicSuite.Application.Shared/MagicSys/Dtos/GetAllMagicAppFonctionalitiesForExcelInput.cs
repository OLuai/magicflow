using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppFonctionalitiesForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public string AppVersionFilter { get; set; }

		public DateTime? MaxPlannedIntegrationDateFilter { get; set; }
		public DateTime? MinPlannedIntegrationDateFilter { get; set; }

		public DateTime? MaxIntegrationDateFilter { get; set; }
		public DateTime? MinIntegrationDateFilter { get; set; }

		public DateTime? MaxPlannedDevStartingDateFilter { get; set; }
		public DateTime? MinPlannedDevStartingDateFilter { get; set; }

		public DateTime? MaxDevStartingDateFilter { get; set; }
		public DateTime? MinDevStartingDateFilter { get; set; }

		public DateTime? MaxPlannedDevEndingDateFilter { get; set; }
		public DateTime? MinPlannedDevEndingDateFilter { get; set; }

		public DateTime? MaxPlannedTestStartFilter { get; set; }
		public DateTime? MinPlannedTestStartFilter { get; set; }

		public DateTime? MaxPlannedTestEndingDateFilter { get; set; }
		public DateTime? MinPlannedTestEndingDateFilter { get; set; }

		public DateTime? MaxDevEndingDateFilter { get; set; }
		public DateTime? MinDevEndingDateFilter { get; set; }

		public DateTime? MaxTestEndingDateFilter { get; set; }
		public DateTime? MinTestEndingDateFilter { get; set; }


		 public string MagicAppFonctionalityCategoryNameFilter { get; set; }

		 		 public string MagicAppNameFilter { get; set; }

		 		 public string UserNameFilter { get; set; }

		 		 public string UserName2Filter { get; set; }

		 
    }
}