
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityFieldGroupDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }

		public string DisplayName { get; set; }
		
		public string LocalizationName { get; set; }

		public  string Description { get; set; }
		public string SystemIcon { get; set; }

		public string IconUrl { get; set; }


		 public string EntityId { get; set; }

		 
    }
}