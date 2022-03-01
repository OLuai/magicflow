
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicPageDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }

		public  string LocalizationName { get; set; }

		public string Description { get; set; }

		public string ActiveVersion { get; set; }

		public bool IsActive { get; set; }

		public string SystemIcon { get; set; }

		public string IconUrl { get; set; }

		public string SolutionId { get; set; }

		 		 public string PageTypeId { get; set; }

		 		 public string PageUsedTypeId { get; set; }

		 		 public string EntityId { get; set; }


		//Gestion des permissions
		public virtual bool IsPublic { get; set; }
		public virtual string AccessPermissionName { get; set; }


		public  string DestinationDeviceTypeId { get; set; }

	}
}