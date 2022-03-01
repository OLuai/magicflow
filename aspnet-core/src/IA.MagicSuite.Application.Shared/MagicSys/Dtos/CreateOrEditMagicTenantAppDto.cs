
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicTenantAppDto : EntityDto<long?>
    {

		[StringLength(MagicTenantAppConsts.MaxVersionNameLength, MinimumLength = MagicTenantAppConsts.MinVersionNameLength)]
		public string VersionName { get; set; }
		
		
		public DateTime InstallDate { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		 public string AppId { get; set; }
		 
		 
    }
}