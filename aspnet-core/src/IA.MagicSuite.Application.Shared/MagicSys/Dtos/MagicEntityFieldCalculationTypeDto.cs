
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityFieldCalculationTypeDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string Description { get; set; }



    }
}