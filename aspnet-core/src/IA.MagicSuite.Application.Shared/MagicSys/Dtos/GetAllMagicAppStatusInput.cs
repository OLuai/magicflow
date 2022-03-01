using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppStatusInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public int? MaxNumericCodeFilter { get; set; }
		public int? MinNumericCodeFilter { get; set; }

		public string NameFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }

		public int? IsActiveFilter { get; set; }



    }
}