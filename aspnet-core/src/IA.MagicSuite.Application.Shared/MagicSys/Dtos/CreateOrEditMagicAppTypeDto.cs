
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppTypeDto : EntityDto<string>
    {

		[Required]
		public string Name { get; set; }
		
		
		[StringLength(MagicAppTypeConsts.MaxSystemIconLength, MinimumLength = MagicAppTypeConsts.MinSystemIconLength)]
		public string SystemIcon { get; set; }
		
		

    }
}