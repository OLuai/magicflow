
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicPageTypeDto : EntityDto<string>
    {

		[StringLength(MagicPageTypeConsts.MaxIconUrlLength, MinimumLength = MagicPageTypeConsts.MinIconUrlLength)]
		public string IconUrl { get; set; }
		
		

    }
}