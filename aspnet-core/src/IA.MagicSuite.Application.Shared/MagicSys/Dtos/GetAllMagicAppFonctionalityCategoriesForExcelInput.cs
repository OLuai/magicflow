using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppFonctionalityCategoriesForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public int? IsOptionalFilter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 
    }
}