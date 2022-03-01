
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicEntityConsts.MaxNameLength)]
		public string Name { get; set; }
				
		[Required]
		[StringLength(MagicEntityConsts.MaxDisplayNameLength)]
		public string DisplayName { get; set; }
				
		[Required]
		[StringLength(MagicEntityConsts.MaxPluralDisplayNameLength)]
		public string PluralDisplayName { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		public bool IsVirtualEntity { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxColorOrClassNameLength)]
		public string ColorOrClassName { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxIconUrlLength)]
		public string IconUrl { get; set; }
		
		
		public bool IsActivityEntity { get; set; }
		
		
		public bool IsDisplayInActivityMenus { get; set; }
		
		
		public string AutomaticDisplayMenus { get; set; }
		public bool UseBusinessProcess { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxDefaultBusinessProcessIdLength)]
		public string DefaultBusinessProcessId { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxStatusFieldNameLength)]
		public string StatusFieldName { get; set; }
		
		
		public bool UseNotes { get; set; }
		public bool UseActivites { get; set; }
		public bool UseDocuments { get; set; }
		public bool UseFollowers { get; set; }
		public bool UseConnections { get; set; }
		public bool AllowAddInQueues { get; set; }
		public bool AutoAddNewRecordInQueues { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxConnectionNameLength)]
		public string ConnectionName { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxDbTableOrViewNameLength)]
		public string DbTableOrViewName { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public string IdFieldName { get; set; }
		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public string DisplayFieldName { get; set; } //nom du champ utilisé pour afficher l'info à l'utilisateur dans les combos et quickSearch

		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public string SystemIconFieldName { get; set; } //nom du champ utilisé pour afficher une image système représentant l'enregistrement

		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public string IconUrlFieldName { get; set; } //nom du champ utilisé pour afficher une image depuis une url représentant l'enregistrement

		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public string ImageFieldName { get; set; } //nom du champ utilisé pour afficher une image base64 ou Bytearray représentant la photo ou l'image principale de l'enregistrement


		public string DefaultSelectSql { get; set; }
		public bool AllowInsert { get; set; }
		public bool AllowUpdate { get; set; }
		public bool AllowDelete { get; set; }		
		public bool AllowOData { get; set; }

		public bool AutoGenCrudSql { get; set; }		
		public string InsertSql { get; set; }		
		public string UpdateSql { get; set; }
		
		public string DeleteSql { get; set; }		
		
		public bool IsDefaultSelectSqlSP { get; set; }		
		
		public bool IsInsertSqlSP { get; set; }		
		
		public bool IsUpdateSqlSP { get; set; }		
		
		public bool IsDeleteSqlSP { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxInsertIdGeneratorIdLength)]
		public string InsertIdGeneratorId { get; set; }
		
		
		public string CrudIgnoreFields { get; set; }
		
		
		public string InsertOnlyIgnoreFields { get; set; }
		
		
		public string UpdateOnlyIgnoreFields { get; set; }
		
		
		public string AutoGenCrudSelectSql { get; set; }


		//Mobile information
		public bool EnableForMobile { get; set; }
		
		public bool ReadOnlyInMobile { get; set; }
		
		public bool EnableOfflineMode { get; set; }
		
		public bool UseCustomHelp { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxCustomHelpUrlLength)]
		public string CustomHelpUrl { get; set; }
		
		
		public bool IsActive { get; set; }

		public bool MayHaveTenant { get; set; }
		public bool IsFullAudited { get; set; }
		
		
		public bool TrackChangesHistory { get; set; }
		
		
		public bool IsHostEntity { get; set; }
		
		
		public bool DisableCrossSiteAccess { get; set; }
		
		
		public bool UseConfidentiality { get; set; }
		
		
		[StringLength(MagicEntityConsts.MaxConfidentialityFieldNameLength)]
		public string ConfidentialityFieldName { get; set; }


		public bool UseSecurityLevel { get; set; }
		public int? DefaultSecurityLevel { get; set; }		
		
		[StringLength(MagicEntityConsts.MaxSecurityLevelFieldNameLength)]
		public string SecurityLevelFieldName { get; set; }

		//Gestion des permissions		
		public string AccessPermissionName { get; set; }
		public string CreatePermissionName { get; set; }
		public string EditPermissionName { get; set; }
		public string DeletePermissionName { get; set; }
		public  bool UseSelectedFieldsOnly { get; set; }

		public string PreviewHtmlTemplate { get; set; }
		
		
		 public string SolutionId { get; set; }
		 
		 		 public string DataOwnerShipId { get; set; }
		 
		 		 public string DefaultFormId { get; set; }
		 
		 		 public string DefaultPreviewReportId { get; set; }
		 
		 		 public string DefaultQuickCreateFormId { get; set; }
		 
		 
    }
}