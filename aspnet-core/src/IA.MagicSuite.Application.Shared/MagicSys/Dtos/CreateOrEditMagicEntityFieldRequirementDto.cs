
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityFieldRequirementDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityFieldRequirementConsts.MaxNameLength, MinimumLength = MagicEntityFieldRequirementConsts.MinNameLength)]
		public string Name { get; set; }
		
		

    }
}