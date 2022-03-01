using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppsForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public string ActiveVersionFilter { get; set; }

		public string ColorOrClassNameFilter { get; set; }

		public int? UseDefaultIconFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public int? IsSystemAppFilter { get; set; }


		 public string MagicSolutionNameFilter { get; set; }

		 		 public string MagicAppTypeNameFilter { get; set; }

		 		 public string MagicAppStatusNameFilter { get; set; }

		 
    }
}