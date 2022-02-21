using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_SolutionConnections")]
    [Audited]
    public class MagicSolutionConnection : FullAuditedEntity<string> , IMayHaveTenant, IPassivable
	{
        public MagicSolutionConnection()
        {
			IsActive = true;
		}

        public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicSolutionConnectionConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		public virtual string ConnectionString { get; set; }
		
		public virtual bool IsActive { get; set; }

		[Required]
		public virtual string SolutionId { get; set; }
		
        [ForeignKey("SolutionId")]
		public MagicSolution SolutionFk { get; set; }
		
    }
}