using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Controls")]
    public class MagicControl : Entity<string> 
    {

		[Required]
		[StringLength(MagicControlConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		[StringLength(MagicControlConsts.MaxCategoryLength)]
		public virtual string Category { get; set; }
		
		[StringLength(MagicControlConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[Required]
		[StringLength(MagicControlConsts.MaxSubCategoryLength)]
		public virtual string SubCategory { get; set; }
		
		[StringLength(MagicControlConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		

    }
}