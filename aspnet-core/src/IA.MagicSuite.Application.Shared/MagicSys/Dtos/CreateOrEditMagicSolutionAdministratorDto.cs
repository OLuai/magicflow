
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicSolutionAdministratorDto : EntityDto<long?>
    {

		public bool IsActive { get; set; }
		
		
		 public long UserId { get; set; }
		 
		 		 public string SolutionId { get; set; }
		 
		 
    }
}