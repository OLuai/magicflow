using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicSolutionForEditOutput
    {
		public CreateOrEditMagicSolutionDto MagicSolution { get; set; }

		public string UserName { get; set;}

		public string MagicVendorName { get; set;}


    }
}