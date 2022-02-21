using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppVersionHistories")]
    [Audited]
    public class MagicAppVersionHistory : FullAuditedEntity<long> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppVersionHistoryConsts.MaxVersionNameLength)]
		public virtual string VersionName { get; set; }
		
		public virtual DateTime VersionDate { get; set; }
		

		public virtual string AppId { get; set; }
		
        [ForeignKey("AppId")]
		public MagicApp AppFk { get; set; }


		[StringLength(int.MaxValue)]//cas 1. pour créer un varchar max
		[MaxLength] //cas 2. pour créer un varchar max, j'utilise le 2 cas au cas ou un ne marcherai pas pour un type de base de données spécifique
		public virtual string VersionObject { get; set; }

	}
}