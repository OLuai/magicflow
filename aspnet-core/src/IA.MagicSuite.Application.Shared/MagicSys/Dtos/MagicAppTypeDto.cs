
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppTypeDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string SystemIcon { get; set; }



    }
}