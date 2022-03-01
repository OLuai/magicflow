using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityForEditOutput
    {
		public CreateOrEditMagicEntityDto MagicEntity { get; set; }

		public string MagicSolutionName { get; set;}

		public string MagicDataOwnerShipName { get; set;}

		public string MagicPageName { get; set;}

		public string MagicPageName2 { get; set;}

		public string MagicPageName3 { get; set;}


    }
}