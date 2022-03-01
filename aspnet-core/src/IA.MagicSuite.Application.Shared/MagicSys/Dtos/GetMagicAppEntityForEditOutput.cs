using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppEntityForEditOutput
    {
		public CreateOrEditMagicAppEntityDto AppEntity { get; set; }

		public string MagicAppName { get; set;}

		public string MagicEntityDisplayName { get; set;}


    }
}