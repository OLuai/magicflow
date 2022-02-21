using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityFieldDataTypes")]
    public class MagicEntityFieldDataType : Entity<string> 
    {

		[Required]
		[StringLength(MagicEntityFieldDataTypeConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicEntityFieldDataTypeConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		

    }
}