
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicDataOwnerShipDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string DisplayName { get; set; }

		public string SystemIcon { get; set; }



    }
}