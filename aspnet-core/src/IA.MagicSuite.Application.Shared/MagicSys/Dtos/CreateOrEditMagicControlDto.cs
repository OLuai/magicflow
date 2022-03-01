
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicControlDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicControlConsts.MaxNameLength, MinimumLength = MagicControlConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[Required]
		[StringLength(MagicControlConsts.MaxCategoryLength, MinimumLength = MagicControlConsts.MinCategoryLength)]
		public string Category { get; set; }
		
		
		[StringLength(MagicControlConsts.MaxDescriptionLength, MinimumLength = MagicControlConsts.MinDescriptionLength)]
		public string Description { get; set; }
		
		
		[Required]
		[StringLength(MagicControlConsts.MaxSubCategoryLength, MinimumLength = MagicControlConsts.MinSubCategoryLength)]
		public string SubCategory { get; set; }
		
		
		[StringLength(MagicControlConsts.MaxIconUrlLength, MinimumLength = MagicControlConsts.MinIconUrlLength)]
		public string IconUrl { get; set; }
		
		

    }
}