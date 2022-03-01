using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicEntitiesInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DisplayNameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public int? IsVirtualEntityFilter { get; set; }

		public string ColorOrClassNameFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }

		public int? IsActivityEntityFilter { get; set; }

		public int? IsDisplayInActivityMenusFilter { get; set; }

		public string AutomaticDisplayMenusFilter { get; set; }

		public int? UseBusinessProcessFilter { get; set; }

		public string DefaultBusinessProcessIdFilter { get; set; }

		public string StatusFieldNameFilter { get; set; }

		public int? UseNotesFilter { get; set; }

		public int? UseActivitesFilter { get; set; }

		public int? UseDocumentsFilter { get; set; }

		public int? UseFollowersFilter { get; set; }

		public int? UseConnectionsFilter { get; set; }

		public int? AllowAddInQueuesFilter { get; set; }

		public int? AutoAddNewRecordInQueuesFilter { get; set; }

		public string ConnectionNameFilter { get; set; }

		public string DbTableOrViewNameFilter { get; set; }

		public string IdFieldNameFilter { get; set; }

		public string DefaultSelectSqlFilter { get; set; }

		public int? AllowInsertFilter { get; set; }

		public int? AllowUpdateFilter { get; set; }

		public int? AllowDeleteFilter { get; set; }

		public int? AllowODataFilter { get; set; }

		public int? AutoGenCrudSqlFilter { get; set; }

		public string InsertSqlFilter { get; set; }

		public string UpdateSqlFilter { get; set; }

		public string DeleteSqlFilter { get; set; }

		public int? IsDefaultSelectSqlSPFilter { get; set; }

		public int? IsInsertSqlSPFilter { get; set; }

		public int? IsUpdateSqlSPFilter { get; set; }

		public int? IsDeleteSqlSPFilter { get; set; }

		public string InsertIdGeneratorIdFilter { get; set; }

		public string CrudIgnoreFieldsFilter { get; set; }

		public string InsertOnlyIgnoreFieldsFilter { get; set; }

		public string UpdateOnlyIgnoreFieldsFilter { get; set; }

		public string AutoGenCrudSelectSqlFilter { get; set; }

		public int? EnableForMobileFilter { get; set; }

		public int? ReadOnlyInMobileFilter { get; set; }

		public int? EnableOfflineModeFilter { get; set; }

		public int? UseCustomHelpFilter { get; set; }

		public string CustomHelpUrlFilter { get; set; }

		public int? IsActiveFilter { get; set; }

		public int? IsFullAuditedFilter { get; set; }

		public int? TrackChangesHistoryFilter { get; set; }

		public int? IsHostEntityFilter { get; set; }

		public int? DisableCrossSiteAccessFilter { get; set; }

		public int? UseConfidentialityFilter { get; set; }

		public string ConfidentialityFieldNameFilter { get; set; }

		public int? MaxDefaultSecurityLevelFilter { get; set; }
		public int? MinDefaultSecurityLevelFilter { get; set; }

		public string SecurityLevelFieldNameFilter { get; set; }

		public string PreviewHtmlTemplateFilter { get; set; }


		 public string MagicSolutionNameFilter { get; set; }

		 		 public string MagicDataOwnerShipNameFilter { get; set; }

		 		 public string MagicPageNameFilter { get; set; }

		 		 public string MagicPageName2Filter { get; set; }

		 		 public string MagicPageName3Filter { get; set; }

		 
    }
}