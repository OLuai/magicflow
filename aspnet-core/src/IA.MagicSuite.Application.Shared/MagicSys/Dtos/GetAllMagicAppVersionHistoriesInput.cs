using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppVersionHistoriesInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string VersionNameFilter { get; set; }

		public DateTime? MaxVersionDateFilter { get; set; }
		public DateTime? MinVersionDateFilter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 
    }
}