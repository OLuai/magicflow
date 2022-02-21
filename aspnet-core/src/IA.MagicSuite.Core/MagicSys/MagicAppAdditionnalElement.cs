using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppAdditionnalElements")]
    public class MagicAppAdditionnalElement : FullAuditedEntity<string> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppAdditionnalElementConsts.MaxNameLength, MinimumLength = MagicAppAdditionnalElementConsts.MinNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		[StringLength(MagicAppAdditionnalElementConsts.MaxTypeLength, MinimumLength = MagicAppAdditionnalElementConsts.MinTypeLength)]
		public virtual string Type { get; set; }

		[StringLength(int.MaxValue)]
		public virtual string StringValue { get; set; }

		public virtual byte[] binaryValue { get; set; }

		public virtual double? NumericValue { get; set; }
		
		public virtual DateTime? DateValue { get; set; }
		
		public virtual int? OrderNumber { get; set; }
		
		[StringLength(MagicAppAdditionnalElementConsts.MaxLinkedObjectNameLength, MinimumLength = MagicAppAdditionnalElementConsts.MinLinkedObjectNameLength)]
		public virtual string LinkedObjectName { get; set; }
		
		public virtual string ParentId { get; set; }		

		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
    }
}