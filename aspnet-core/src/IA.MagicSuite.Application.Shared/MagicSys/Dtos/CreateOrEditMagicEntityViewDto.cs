
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityViewDto : EntityDto<string>
    {
		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public string Name { get; set; }

		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public string Description { get; set; }

		public string ViewOptions { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		public string AdditionalData { get; set; }
		
		
		 public string EntityId { get; set; }
		 
		 		 public string EntityViewTypeId { get; set; }
		 
		 
    }
}