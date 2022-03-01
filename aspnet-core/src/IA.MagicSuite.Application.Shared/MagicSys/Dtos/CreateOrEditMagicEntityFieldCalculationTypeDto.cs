
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityFieldCalculationTypeDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityFieldCalculationTypeConsts.MaxNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicEntityFieldCalculationTypeConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		

    }
}