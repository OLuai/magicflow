
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicPageDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicPageConsts.MaxNameLength)]
		public string Name { get; set; }

		[StringLength(MagicPageConsts.MaxNameLength)]
		public string LocalizationName { get; set; }

		[StringLength(MagicPageConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		[StringLength(MagicPageConsts.MaxActiveVersionLength)]
		public string ActiveVersion { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		[StringLength(MagicPageConsts.MaxSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicPageConsts.MaxIconUrlLength)]
		public string IconUrl { get; set; }

		//Gestion des permissions
		public bool IsPublic { get; set; }
		public string AccessPermissionName { get; set; }

		public string SolutionId { get; set; }
		 
		 		 public string PageTypeId { get; set; }
		 
		 		 public string PageUsedTypeId { get; set; }
		 
		 		 public string EntityId { get; set; }

		public string DestinationDeviceTypeId { get; set; }


	}
}