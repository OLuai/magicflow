
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppVersionHistoryDto : EntityDto<long>
    {
		public string VersionName { get; set; }

		public DateTime VersionDate { get; set; }


		 public string AppId { get; set; }

		 
    }
}