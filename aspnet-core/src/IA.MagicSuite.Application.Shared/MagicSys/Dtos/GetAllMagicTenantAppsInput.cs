using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicTenantAppsInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string VersionNameFilter { get; set; }

		public DateTime? MaxInstallDateFilter { get; set; }
		public DateTime? MinInstallDateFilter { get; set; }

		public int? IsActiveFilter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 
    }
}