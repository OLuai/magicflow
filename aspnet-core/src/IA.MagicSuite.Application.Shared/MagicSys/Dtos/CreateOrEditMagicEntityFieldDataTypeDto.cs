
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityFieldDataTypeDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityFieldDataTypeConsts.MaxNameLength, MinimumLength = MagicEntityFieldDataTypeConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxDescriptionLength, MinimumLength = MagicEntityFieldDataTypeConsts.MinDescriptionLength)]
		public string Description { get; set; }
		
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxSystemIconLength, MinimumLength = MagicEntityFieldDataTypeConsts.MinSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxIconUrlLength, MinimumLength = MagicEntityFieldDataTypeConsts.MinIconUrlLength)]
		public string IconUrl { get; set; }
		
		

    }
}