
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicSolutionConnectionDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicSolutionConnectionConsts.MaxNameLength, MinimumLength = MagicSolutionConnectionConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[Required]
		public string ConnectionString { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		 public string SolutionId { get; set; }
		 
		 
    }
}