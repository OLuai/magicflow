using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppForEditOutput
    {
		public CreateOrEditMagicAppDto MagicApp { get; set; }

		public string MagicSolutionName { get; set;}

		public string MagicAppTypeName { get; set;}

		public string MagicAppStatusName { get; set;}


    }
}