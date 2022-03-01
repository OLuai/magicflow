
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppFonctionalityCategoryDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicAppFonctionalityCategoryConsts.MaxNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicAppFonctionalityCategoryConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		public bool IsOptional { get; set; }
		
		
		 public string AppId { get; set; }
		 
		 
    }
}