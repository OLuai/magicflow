using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_DataOwnerShips")]
    public class MagicDataOwnerShip : Entity<string> 
    {

		[Required]
		[StringLength(MagicDataOwnerShipConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[Required]
		[StringLength(MagicDataOwnerShipConsts.MaxDisplayNameLength)]
		public virtual string DisplayName { get; set; }
		
		[StringLength(MagicDataOwnerShipConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		

    }
}