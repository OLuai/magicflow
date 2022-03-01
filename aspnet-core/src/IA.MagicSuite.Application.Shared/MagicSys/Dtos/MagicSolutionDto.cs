
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicSolutionDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }

		public string Description { get; set; }

		public bool IsActive { get; set; }

		public string ColorOrClassName { get; set; }
		
		public string IconUrl { get; set; }
		public string SystemIcon { get; set; }


		 public long OwnerId { get; set; }

		 		 public long VendorId { get; set; }

		public  bool AppsAreOnlyEditableByAppOwner { get; set; }

	}
}