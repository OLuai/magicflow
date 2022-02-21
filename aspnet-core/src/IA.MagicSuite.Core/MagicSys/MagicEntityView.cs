using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityViews")]
    [Audited]
    public class MagicEntityView : FullAuditedEntity<string> , IMayHaveTenant, IPassivable 
    {
		public MagicEntityView()
		{
			IsActive = true;

		}

		public int? TenantId { get; set; }

		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public virtual string Name { get; set; }

		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }


		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string ViewOptions { get; set; }
		
		public virtual bool IsActive { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string AdditionalData { get; set; }
		

		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }
		
		public virtual string ViewTypeId { get; set; }
		
        [ForeignKey("ViewTypeId")]
		public MagicEntityViewType EntityViewTypeFk { get; set; }
		
    }
}