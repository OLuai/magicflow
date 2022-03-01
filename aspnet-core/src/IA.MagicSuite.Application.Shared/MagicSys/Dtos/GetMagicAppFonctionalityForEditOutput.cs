using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppFonctionalityForEditOutput
    {
		public CreateOrEditMagicAppFonctionalityDto MagicAppFonctionality { get; set; }

		public string MagicAppFonctionalityCategoryName { get; set;}

		public string MagicAppName { get; set;}

		public string UserName { get; set;}

		public string UserName2 { get; set;}


    }
}