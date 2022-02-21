using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppStatus")]
    [Audited]
    public class MagicAppStatus : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		public virtual int NumericCode { get; set; }
		
		[Required]
		[StringLength(MagicAppStatusConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppStatusConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicAppStatusConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		
		public virtual bool IsActive { get; set; }
		

    }
}