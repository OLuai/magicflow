using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicEntityFieldCalculationTypesForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }



    }
}