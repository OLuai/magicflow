
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityViewTypeDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string Description { get; set; }

		public string SystemIcon { get; set; }



    }
}