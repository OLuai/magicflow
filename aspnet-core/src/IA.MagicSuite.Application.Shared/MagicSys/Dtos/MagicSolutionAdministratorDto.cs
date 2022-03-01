
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicSolutionAdministratorDto : EntityDto<long>
    {
		public bool IsActive { get; set; }


		 public long UserId { get; set; }

		 		 public string SolutionId { get; set; }

		 
    }
}