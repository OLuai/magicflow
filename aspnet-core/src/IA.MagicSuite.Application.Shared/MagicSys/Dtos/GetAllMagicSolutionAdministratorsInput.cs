using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicSolutionAdministratorsInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public int? IsActiveFilter { get; set; }


		 public string UserNameFilter { get; set; }

		 		 public string MagicSolutionNameFilter { get; set; }

		 
    }
}