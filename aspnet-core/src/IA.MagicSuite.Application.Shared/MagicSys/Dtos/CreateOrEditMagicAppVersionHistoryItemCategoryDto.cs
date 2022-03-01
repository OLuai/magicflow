
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppVersionHistoryItemCategoryDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxCodeLength)]
		public string Code { get; set; }
		
		
		[Required]
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		 public int? LanguageId { get; set; }
		 
		 
    }
}