using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppFonctionalityCategories")]
    [Audited]
    public class MagicAppFonctionalityCategory : FullAuditedEntity<string>, IMayHaveTenant, IPassivable
	{

		public MagicAppFonctionalityCategory()
		{
			IsActive = true;
			IsOptional = false;
		}

		public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppFonctionalityCategoryConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppFonctionalityCategoryConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		public virtual bool IsActive { get; set; }
		
		public virtual bool IsOptional { get; set; }
		

		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
    }
}