using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicPageForEditOutput
    {
		public CreateOrEditMagicPageDto MagicPage { get; set; }

		public string MagicSolutionName { get; set;}

		public string MagicPageTypeName { get; set;}

		public string MagicPageTypeName2 { get; set;}

		public string MagicEntityName { get; set;}


    }
}