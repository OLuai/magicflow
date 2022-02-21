using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	/// <summary>
	/// Objet pour garder la liste des type device de destination d'une page etc, WEB, MOBILE, MIXTE
	/// </summary>
	[Table("IASYS_DestinationDeviceType")]
    public class MagicDestinationDeviceType : Entity<string> 
    {

		[Required]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppTypeConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		

    }
}