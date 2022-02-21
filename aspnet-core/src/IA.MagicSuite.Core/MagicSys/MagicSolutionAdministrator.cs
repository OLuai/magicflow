using IA.MagicSuite.Authorization.Users;
using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_SolutionAdministrators")]
    [Audited]
    public class MagicSolutionAdministrator : FullAuditedEntity<long> , IMayHaveTenant, IPassivable
	{
		public MagicSolutionAdministrator()
		{
			IsActive = true;
			IsCoowner = false;
		}

		public int? TenantId { get; set; }

		public virtual bool IsActive { get; set; }

		public virtual bool IsCoowner { get; set; }
		public virtual long UserId { get; set; }
		
        [ForeignKey("UserId")]
		public User UserFk { get; set; }
		
		public virtual string SolutionId { get; set; }
		
        [ForeignKey("SolutionId")]
		public MagicSolution SolutionFk { get; set; }
		
    }
}