
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string UniqueName { get; set; }

		public string Description { get; set; }

		public string ActiveVersion { get; set; }

		public string ColorOrClassName { get; set; }

		public bool UseDefaultIcon { get; set; }

		public string SystemIcon { get; set; }

		public string IconUrl { get; set; }

		public bool IsActive { get; set; }

		public bool IsSystemApp { get; set; }


		 public string SolutionId { get; set; }

		 		 public string AppTypeId { get; set; }

		 		 public long? AppStatusId { get; set; }

		public DateTime CreationTime { get; set; }

		public DateTime? LastModificationTime { get; set; }


	}
}