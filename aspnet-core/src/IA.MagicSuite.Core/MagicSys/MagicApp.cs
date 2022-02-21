using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using IA.MagicSuite.Authorization.Users;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Apps")]
    [Audited]
    public class MagicApp : FullAuditedEntity<string> , IMayHaveTenant
    {
		public MagicApp()
		{
			IsActive = true;
			IsSystemApp = false;						
		}
		public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppConsts.MaxNameLength)]
		public virtual string Name { get; set; }		
				
		[StringLength(MagicAppConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		public virtual long OwnerId { get; set; }

		[ForeignKey("OwnerId")]
		public User OwnerFk { get; set; }

		[StringLength(MagicAppConsts.MaxActiveVersionLength)]
		public virtual string ActiveVersion { get; set; }
		
		[StringLength(MagicAppConsts.MaxColorOrClassNameLength)]
		public virtual string ColorOrClassName { get; set; }
		
		public virtual bool UseDefaultIcon { get; set; }
		
		[StringLength(MagicAppConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicAppConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		
		public virtual bool IsActive { get; set; }
		
		public virtual bool IsSystemApp { get; set; }		

		public virtual string SolutionId { get; set; }
		
        [ForeignKey("SolutionId")]
		public MagicSolution SolutionFk { get; set; }
		
		public virtual string AppTypeId { get; set; }
		
        [ForeignKey("AppTypeId")]
		public MagicAppType AppTypeFk { get; set; }
		
		public virtual long? AppStatusId { get; set; }
		
        [ForeignKey("AppStatusId")]
		public MagicAppStatus AppStatusFk { get; set; }
		
    }
}