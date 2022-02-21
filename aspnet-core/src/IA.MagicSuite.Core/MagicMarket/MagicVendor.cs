using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicMarket
{
	[Table("IAMKT_Vendors")]
    [Audited]
    public class MagicVendor : FullAuditedEntity<string> 
    {

		[Required]
		//[StringLength(MagicVendorConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		//[StringLength(MagicVendorConsts.MaxAcronymLength)]
		public virtual string Acronym { get; set; }
		
		public virtual bool IsActive { get; set; }
		
		public virtual int? TenantId { get; set; }
		

    }
}