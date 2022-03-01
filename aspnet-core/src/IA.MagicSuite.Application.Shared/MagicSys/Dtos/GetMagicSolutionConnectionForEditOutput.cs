using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicSolutionConnectionForEditOutput
    {
		public CreateOrEditMagicSolutionConnectionDto MagicSolutionConnection { get; set; }

		public string MagicSolutionName { get; set;}


    }
}