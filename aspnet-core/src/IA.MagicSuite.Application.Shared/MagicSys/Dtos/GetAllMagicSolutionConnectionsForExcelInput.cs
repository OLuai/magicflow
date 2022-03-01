using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicSolutionConnectionsForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public int? IsActiveFilter { get; set; }


		 public string MagicSolutionNameFilter { get; set; }

		 
    }
}