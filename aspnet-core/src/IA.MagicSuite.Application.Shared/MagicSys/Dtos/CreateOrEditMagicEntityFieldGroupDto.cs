
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityFieldGroupDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public string Name { get; set; }

		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public  string DisplayName { get; set; }

		[StringLength(MagicEntityFieldGroupConsts.MaxNameLength)]
		public  string LocalizationName { get; set; }


		[StringLength(MagicEntityFieldGroupConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		[StringLength(MagicEntityFieldGroupConsts.MaxSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicEntityFieldGroupConsts.MaxIconUrlLength)]
		public string IconUrl { get; set; }
		
		
		 public string EntityId { get; set; }
		 
		 
    }
}