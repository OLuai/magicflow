using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppVersionHistoryItemCategoriesForExcelInput
    {
		public string Filter { get; set; }

		public string CodeFilter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }


		 public string ApplicationLanguageNameFilter { get; set; }

		 
    }
}