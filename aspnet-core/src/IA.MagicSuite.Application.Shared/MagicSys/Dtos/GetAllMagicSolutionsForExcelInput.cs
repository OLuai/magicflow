using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicSolutionsForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public string ColorOrClassNameFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }


		 public string UserNameFilter { get; set; }

		 		 public string MagicVendorNameFilter { get; set; }

		 
    }
}