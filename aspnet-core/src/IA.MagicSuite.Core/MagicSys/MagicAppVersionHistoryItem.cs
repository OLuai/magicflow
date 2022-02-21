
using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppVersionHistoryItems")]
    [Audited]
    public class MagicAppVersionHistoryItem : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppVersionHistoryItemConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		public virtual string Description { get; set; }
		

		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
		public virtual long VersionHistoryId { get; set; }
		
        [ForeignKey("VersionHistoryId")]
		public MagicAppVersionHistory VersionHistoryFk { get; set; }
		
		public virtual string CategoryId { get; set; }
		
        [ForeignKey("CategoryId")]
		public MagicAppVersionHistoryItemCategory CategoryFk { get; set; }
		
    }
}