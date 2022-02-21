using Abp.Localization;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_AppVersionHistoryItemCategories")]
    public class MagicAppVersionHistoryItemCategory : FullAuditedEntity<string> , IMayHaveTenant
    {
			public int? TenantId { get; set; }
			

		[Required]
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxCodeLength)]
		public virtual string Code { get; set; }
		
		[Required]
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicAppVersionHistoryItemCategoryConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		

		public virtual int? LanguageId { get; set; }
		
        [ForeignKey("LanguageId")]
		public ApplicationLanguage LanguageFk { get; set; }
		
    }
}