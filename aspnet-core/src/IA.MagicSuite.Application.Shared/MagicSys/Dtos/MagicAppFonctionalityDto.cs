
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppFonctionalityDto : EntityDto<long>
    {
		public string Name { get; set; }

		public string Description { get; set; }

		public string AppVersion { get; set; }

		public DateTime PlannedIntegrationDate { get; set; }

		public DateTime? IntegrationDate { get; set; }

		public DateTime? PlannedDevStartingDate { get; set; }

		public DateTime? DevStartingDate { get; set; }

		public DateTime? PlannedDevEndingDate { get; set; }

		public DateTime? PlannedTestStart { get; set; }

		public DateTime? PlannedTestEndingDate { get; set; }

		public DateTime? DevEndingDate { get; set; }

		public DateTime? TestEndingDate { get; set; }


		 public string AppFonctionalityCategoryId { get; set; }

		 		 public string AppId { get; set; }

		 		 public long? OwnerId { get; set; }

		 		 public long? TestOwnerId { get; set; }

		 
    }
}