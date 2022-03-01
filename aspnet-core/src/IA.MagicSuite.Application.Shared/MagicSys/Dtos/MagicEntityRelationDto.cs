
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityRelationDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }

		
		public string DisplayName { get; set; }

		
		public string LocalizationName { get; set; }

		
		public string Description { get; set; }

		public bool? IsActive { get; set; }

		public string EntityId { get; set; }

		public string EntityFieldName { get; set; }

		public string ChildEntityId { get; set; }

		public string ChildEntityFieldName { get; set; }
	}
}