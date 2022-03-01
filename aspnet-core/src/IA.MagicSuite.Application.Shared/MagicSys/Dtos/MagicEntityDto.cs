
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityDto : FullAuditedEntityDto<string>
    {
		public string Name { get; set; }
		public string UniqueName { get; set; }
		public string DisplayName { get; set; }

		public string Description { get; set; }

		public bool IsVirtualEntity { get; set; }

		public string ColorOrClassName { get; set; }

		public string SystemIcon { get; set; }

		public bool IsActivityEntity { get; set; }

		public bool IsDisplayInActivityMenus { get; set; }

		public string AutomaticDisplayMenus { get; set; }

		public bool UseBusinessProcess { get; set; }

		public bool UseNotes { get; set; }

		public bool UseActivites { get; set; }

		public bool UseDocuments { get; set; }

		public bool UseFollowers { get; set; }

		public bool UseConnections { get; set; }

		public bool AllowAddInQueues { get; set; }

		public bool AutoAddNewRecordInQueues { get; set; }

		public string ConnectionName { get; set; }

		public string DbTableOrViewName { get; set; }

		public string IdFieldName { get; set; }
		public string DisplayFieldName { get; set; } //nom du champ utilisé pour afficher l'info à l'utilisateur dans les combos et quickSearch
		
		public string SystemIconFieldName { get; set; } //nom du champ utilisé pour afficher une image système représentant l'enregistrement
		
		public string IconUrlFieldName { get; set; } //nom du champ utilisé pour afficher une image depuis une url représentant l'enregistrement

		public string ImageFieldName { get; set; }


		public bool AllowInsert { get; set; }

		public bool AllowUpdate { get; set; }

		public bool AllowDelete { get; set; }

		public bool AllowOData { get; set; }

		public bool AutoGenCrudSql { get; set; }

		public bool IsDefaultSelectSqlSP { get; set; }

		public bool IsInsertSqlSP { get; set; }

		public bool IsUpdateSqlSP { get; set; }

		public bool IsDeleteSqlSP { get; set; }

		public string InsertIdGeneratorId { get; set; }

		public bool EnableForMobile { get; set; }

		public bool ReadOnlyInMobile { get; set; }

		public bool EnableOfflineMode { get; set; }

		public bool UseCustomHelp { get; set; }

		public bool IsActive { get; set; }
		public bool MayHaveTenant { get; set; }

		public bool IsFullAudited { get; set; }

		public bool TrackChangesHistory { get; set; }

		public bool IsHostEntity { get; set; }

		public bool DisableCrossSiteAccess { get; set; }

		public bool UseConfidentiality { get; set; }

		public string ConfidentialityFieldName { get; set; }
		public bool UseSecurityLevel { get; set; }
		public int? DefaultSecurityLevel { get; set; }
		public string SecurityLevelFieldName { get; set; }

		//Gestion des permissions
		public string AccessPermissionName { get; set; }
		public bool UseSelectedFieldsOnly { get; set; }

		public string SolutionId { get; set; }

		 		 public string DataOwnerShipId { get; set; }

		 		 public string DefaultFormId { get; set; }

		 		 public string DefaultPreviewReportId { get; set; }

		 		 public string DefaultQuickCreateFormId { get; set; }

		 
    }
}