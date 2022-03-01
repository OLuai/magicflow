using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicControlsForExcelInput
    {
		public string Filter { get; set; }

		public string DescriptionFilter { get; set; }

		public string SubCategoryFilter { get; set; }

		public string IconUrlFilter { get; set; }



    }
}