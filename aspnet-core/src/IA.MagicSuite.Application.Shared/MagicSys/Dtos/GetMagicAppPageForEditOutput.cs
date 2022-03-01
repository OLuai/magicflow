using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppPageForEditOutput
    {
		public CreateOrEditMagicAppPageDto MagicAppPage { get; set; }

		public string MagicAppName { get; set;}

		public string MagicEntityName { get; set;}

		public string MagicPageName { get; set;}


    }
}