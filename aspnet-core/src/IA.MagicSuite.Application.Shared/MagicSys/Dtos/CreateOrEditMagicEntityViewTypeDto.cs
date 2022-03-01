
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityViewTypeDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityViewTypeConsts.MaxNameLength, MinimumLength = MagicEntityViewTypeConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[Required]
		[StringLength(MagicEntityViewTypeConsts.MaxDescriptionLength, MinimumLength = MagicEntityViewTypeConsts.MinDescriptionLength)]
		public string Description { get; set; }
		
		
		[StringLength(MagicEntityViewTypeConsts.MaxSystemIconLength, MinimumLength = MagicEntityViewTypeConsts.MinSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicEntityViewTypeConsts.MaxIconUrlLength, MinimumLength = MagicEntityViewTypeConsts.MinIconUrlLength)]
		public string IconUrl { get; set; }
		
		

    }
}