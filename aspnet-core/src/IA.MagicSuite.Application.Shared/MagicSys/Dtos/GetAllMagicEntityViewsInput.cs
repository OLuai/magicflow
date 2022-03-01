using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicEntityViewsInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string ViewOptionsFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public string AdditionalDataFilter { get; set; }


		 public string MagicEntityNameFilter { get; set; }

		 		 public string MagicEntityViewTypeNameFilter { get; set; }

		 
    }
}