
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicSolutionConnectionDto : EntityDto<string>
    {
		public string Name { get; set; }

		public bool IsActive { get; set; }


		 public string SolutionId { get; set; }

		 
    }
}