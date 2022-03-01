using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppEntitiesForExcelInput
    {
		public string Filter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 		 public string MagicEntityDisplayNameFilter { get; set; }

		 
    }
}