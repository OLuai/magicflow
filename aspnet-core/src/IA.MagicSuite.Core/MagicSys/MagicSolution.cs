using IA.MagicSuite.Authorization.Users;
using IA.MagicSuite.MagicMarket;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Solutions")]
    [Audited]
    public class MagicSolution : FullAuditedEntity<string> , IMayHaveTenant, IPassivable
    {
		public MagicSolution()
        {
			IsActive = true;
			AppsAreOnlyEditableByAppOwner = false; //les apps ne sont modifiables (appBuilder) que par leur propriétaire
		}
		public int? TenantId { get; set; }
		
		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength, MinimumLength = MagicSolutionConsts.MinNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		public virtual bool IsActive { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxColorOrClassNameLength)]
		public virtual string ColorOrClassName { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }

		public virtual bool AppsAreOnlyEditableByAppOwner { get; set; }
		public virtual long OwnerId { get; set; }
		
        [ForeignKey("OwnerId")]
		public User OwnerFk { get; set; }
		
		public virtual string VendorId { get; set; }
		
        [ForeignKey("VendorId")]
		public MagicVendor VendorFk { get; set; }
		
    }
}