
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicDataOwnerShipDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicDataOwnerShipConsts.MaxNameLength, MinimumLength = MagicDataOwnerShipConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[Required]
		[StringLength(MagicDataOwnerShipConsts.MaxDisplayNameLength, MinimumLength = MagicDataOwnerShipConsts.MinDisplayNameLength)]
		public string DisplayName { get; set; }
		
		
		[StringLength(MagicDataOwnerShipConsts.MaxSystemIconLength, MinimumLength = MagicDataOwnerShipConsts.MinSystemIconLength)]
		public string SystemIcon { get; set; }
		
		

    }
}