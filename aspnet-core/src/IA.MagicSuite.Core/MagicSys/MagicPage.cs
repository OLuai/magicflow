using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;
using System.Collections.Generic;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Pages")]
    [Audited]
    public class MagicPage : FullAuditedEntity<string> , IMayHaveTenant, IPassivable
    {

		public MagicPage()
		{
			IsActive = true;

		}

		public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicPageConsts.MaxNameLength)]
		public virtual string Name { get; set; }


		/// <summary>
		/// Permet d'afficher le nom de la page en différente lanque dans le UI
		/// </summary>
		[StringLength(MagicPageConsts.MaxNameLength)]
		public virtual string LocalizationName { get; set; }


		[StringLength(MagicPageConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		[StringLength(MagicPageConsts.MaxActiveVersionLength)]
		public virtual string ActiveVersion { get; set; }
		
		public virtual bool IsActive { get; set; }
		
		[StringLength(MagicPageConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicPageConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }

		
		//Gestion des permissions
		public virtual bool IsPublic { get; set; }
		public virtual string AccessPermissionName { get; set; }


		public virtual string SolutionId { get; set; }
		
        [ForeignKey("SolutionId")]
		public MagicSolution SolutionFk { get; set; }
		
		public virtual string PageTypeId { get; set; }
		
        [ForeignKey("PageTypeId")]
		public MagicPageType PageTypeFk { get; set; }
		
		public virtual string PageUsedTypeId { get; set; }
		
        [ForeignKey("PageUsedTypeId")]
		public MagicPageType PageUsedTypeFk { get; set; }
		
		public virtual string EntityId { get; set; }
		
        [ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }

		public virtual string DestinationDeviceTypeId { get; set; }

		[ForeignKey("DestinationDeviceTypeId")]
		public MagicDestinationDeviceType DestinationDeviceTypeFk { get; set; }

		public List<MagicPageVersion> MagicPageVersions { get; set; }

	}
}