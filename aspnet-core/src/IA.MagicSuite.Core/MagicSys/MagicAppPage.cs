
using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppPages")]
    [Audited]
    public class MagicAppPage : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			


		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }
		
		public virtual string PageId { get; set; }
		
        [ForeignKey("PageId")]
		public MagicPage PageFk { get; set; }
		
    }
}