
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityViewDto : EntityDto<string>
    {

		public string Name { get; set; }		
		public string Description { get; set; }
		public string ViewOptions { get; set; }

		public bool IsActive { get; set; }

		 public string EntityId { get; set; }

		 		 public string EntityViewTypeId { get; set; }

		 
    }
}