using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppPagesForExcelInput
    {
		public string Filter { get; set; }


		 public string MagicAppNameFilter { get; set; }

		 		 public string MagicEntityNameFilter { get; set; }

		 		 public string MagicPageNameFilter { get; set; }

		 
    }
}