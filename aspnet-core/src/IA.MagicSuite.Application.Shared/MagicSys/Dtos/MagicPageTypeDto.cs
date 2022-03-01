
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicPageTypeDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string IconUrl { get; set; }



    }
}