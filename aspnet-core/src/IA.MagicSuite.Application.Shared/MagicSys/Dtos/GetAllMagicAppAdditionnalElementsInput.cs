using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppAdditionnalElementsInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 
    }
}