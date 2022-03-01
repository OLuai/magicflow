
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicControlDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string SubCategory { get; set; }

		public string IconUrl { get; set; }



    }
}