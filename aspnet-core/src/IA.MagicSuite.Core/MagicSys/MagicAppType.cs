using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppTypes")]
    public class MagicAppType : Entity<string> 
    {

		[Required]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppTypeConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		

    }
}