
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicTenantAppDto : EntityDto<long>
    {
		public string VersionName { get; set; }

		public DateTime InstallDate { get; set; }

		public bool IsActive { get; set; }


		 public string AppId { get; set; }

		 
    }
}