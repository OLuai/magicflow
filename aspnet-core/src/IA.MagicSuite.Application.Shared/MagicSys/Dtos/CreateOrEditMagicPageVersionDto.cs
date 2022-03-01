
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicPageVersionDto : EntityDto<long?>
    {

		[Required]
		[StringLength(MagicPageVersionConsts.MaxNameLength, MinimumLength = MagicPageVersionConsts.MinNameLength)]
		public string Name { get; set; }
						
		public string PageJSON { get; set; }

		[StringLength(400)]
		public string Description { get; set; }

		public string PageUniqueName { get; set; }


	}
}