using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicPagesForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string UniqueNameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public string ActiveVersionFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }


		 public string MagicSolutionNameFilter { get; set; }

		 		 public string MagicPageTypeNameFilter { get; set; }

		 		 public string MagicPageTypeName2Filter { get; set; }

		 		 public string MagicEntityNameFilter { get; set; }

		 
    }
}