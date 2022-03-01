using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicPageVersionForEditOutput
    {
		public CreateOrEditMagicPageVersionDto MagicPageVersion { get; set; }

		public string MagicPageUniqueName { get; set;}


    }
}