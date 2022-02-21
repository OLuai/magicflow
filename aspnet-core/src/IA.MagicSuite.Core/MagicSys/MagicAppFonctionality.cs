using IA.MagicSuite.MagicSys;
using IA.MagicSuite.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppFonctionalities")]
    [Audited]
    public class MagicAppFonctionality : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppFonctionalityConsts.MaxNameLength, MinimumLength = MagicAppFonctionalityConsts.MinNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppFonctionalityConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[StringLength(MagicAppFonctionalityConsts.MaxAppVersionLength)]
		public virtual string AppVersion { get; set; }
		
		public virtual DateTime PlannedIntegrationDate { get; set; }
		
		public virtual DateTime? IntegrationDate { get; set; }
		
		public virtual DateTime? PlannedDevStartingDate { get; set; }
		
		public virtual DateTime? DevStartingDate { get; set; }
		
		public virtual DateTime? PlannedDevEndingDate { get; set; }
		
		public virtual DateTime? PlannedTestStart { get; set; }
		
		public virtual DateTime? PlannedTestEndingDate { get; set; }
		
		public virtual DateTime? DevEndingDate { get; set; }
		
		public virtual DateTime? TestEndingDate { get; set; }
		

		public virtual string AppFonctionalityCategoryId { get; set; }
		
        [ForeignKey("AppFonctionalityCategoryId")]
		public MagicAppFonctionalityCategory AppFonctionalityCategoryFk { get; set; }
		
		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }
		
		public virtual long? OwnerId { get; set; }
		
        [ForeignKey("OwnerId")]
		public User OwnerFk { get; set; }
		
		public virtual long? TestOwnerId { get; set; }
		
        [ForeignKey("TestOwnerId")]
		public User TestOwnerFk { get; set; }
		
    }
}