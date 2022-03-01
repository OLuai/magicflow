
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityRelationDto : EntityDto<string>
    {

		[Required]		
		public  string Name { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public  string DisplayName { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxNameLength)]
		public  string LocalizationName { get; set; }

		[StringLength(MagicEntityFieldConsts.MaxDescriptionLength)]
		public  string Description { get; set; }

		public  bool? IsActive { get; set; }

		[Required]
		public  string EntityId { get; set; }
		
		public  string EntityFieldName { get; set; }

		[Required]
		public  string ChildEntityId { get; set; }

		[Required]
		public  string ChildEntityFieldName { get; set; }
	}
}