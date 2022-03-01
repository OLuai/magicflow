using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppVersionHistoryItemsInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 		 public string MagicAppVersionHistoryVersionNameFilter { get; set; }

		 		 public string MagicAppVersionHistoryItemCategoryNameFilter { get; set; }

		 
    }
}