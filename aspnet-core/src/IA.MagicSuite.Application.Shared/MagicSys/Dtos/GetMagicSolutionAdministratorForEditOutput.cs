using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicSolutionAdministratorForEditOutput
    {
		public CreateOrEditMagicSolutionAdministratorDto MagicSolutionAdministrator { get; set; }

		public string UserName { get; set;}

		public string MagicSolutionName { get; set;}


    }
}