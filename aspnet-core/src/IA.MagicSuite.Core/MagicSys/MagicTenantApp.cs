using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_TenantApps")]
    [Audited]
    public class MagicTenantApp : FullAuditedEntity<long> , IMustHaveTenant
    {
			public int TenantId { get; set; }
			

		[StringLength(MagicTenantAppConsts.MaxVersionNameLength)]
		public virtual string VersionName { get; set; }
		
		public virtual DateTime InstallDate { get; set; }
		
		public virtual bool IsActive { get; set; }
		

		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
    }
}