using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_PageVersions")]
    [Audited]
    public class MagicPageVersion : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicPageVersionConsts.MaxNameLength)]
		public virtual string Name { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string PageJSON { get; set; }

		[StringLength(400)]
		public virtual string Description { get; set; }

		public virtual string PageId { get; set; }
		
        [ForeignKey("PageId")]
		public MagicPage MagicPageFk { get; set; }
		
    }
}