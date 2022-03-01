
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppVersionHistoryItemDto : EntityDto<long>
    {
		public string Name { get; set; }

		public string Description { get; set; }


		 public string AppId { get; set; }

		 		 public long VersionHistoryId { get; set; }

		 		 public string CategoryId { get; set; }

		 
    }
}