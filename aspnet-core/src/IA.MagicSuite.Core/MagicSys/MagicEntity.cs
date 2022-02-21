using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Entities")]
    [Audited]
    public class MagicEntity : FullAuditedEntity<string> , IMayHaveTenant, IPassivable
	{
		public MagicEntity()
		{
			IsActive = true;
			MayHaveTenant = true;
			IsActivityEntity = true;
			IsVirtualEntity = true;
			UseBusinessProcess = false;

			UseNotes = true;
			UseActivites = true;
			UseDocuments = true;
			UseFollowers = true;
			UseConnections = false;

			AllowAddInQueues = false;
			AutoAddNewRecordInQueues = false;
			
			UseSecurityLevel = false;
			UseSelectedFieldsOnly = false;
		}

		public int? TenantId { get; set; }			

		[Required]
		[StringLength(MagicEntityConsts.MaxNameLength)]
		public virtual string Name { get; set; }
				
		[Required]
		[StringLength(MagicEntityConsts.MaxDisplayNameLength)]
		public virtual string DisplayName { get; set; }
		
		[Required]
		[StringLength(MagicEntityConsts.MaxPluralDisplayNameLength)]
		public virtual string PluralDisplayName { get; set; }
		
		[StringLength(MagicEntityConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
		
		public virtual bool IsVirtualEntity { get; set; }
		
		[StringLength(MagicEntityConsts.MaxColorOrClassNameLength)]
		public virtual string ColorOrClassName { get; set; }
		
		[StringLength(MagicEntityConsts.MaxSystemIconLength)]
		public virtual string SystemIcon { get; set; }
		
		[StringLength(MagicEntityConsts.MaxIconUrlLength)]
		public virtual string IconUrl { get; set; }
		
		public virtual bool IsActivityEntity { get; set; }
		
		public virtual bool IsDisplayInActivityMenus { get; set; }
		
		public virtual string AutomaticDisplayMenus { get; set; }
		
		public virtual bool UseBusinessProcess { get; set; }
		
		[StringLength(MagicEntityConsts.MaxDefaultBusinessProcessIdLength)]
		public virtual string DefaultBusinessProcessId { get; set; }
		
		[StringLength(MagicEntityConsts.MaxStatusFieldNameLength)]
		public virtual string StatusFieldName { get; set; }
		
		public virtual bool UseNotes { get; set; }
		
		public virtual bool UseActivites { get; set; }
		
		public virtual bool UseDocuments { get; set; }
		
		public virtual bool UseFollowers { get; set; }
		
		public virtual bool UseConnections { get; set; }
		
		public virtual bool AllowAddInQueues { get; set; }
		
		public virtual bool AutoAddNewRecordInQueues { get; set; }
		
		
		//Données de la base de données
		[StringLength(MagicEntityConsts.MaxConnectionNameLength)]
		public virtual string ConnectionName { get; set; }
		
		[StringLength(MagicEntityConsts.MaxDbTableOrViewNameLength)]
		public virtual string DbTableOrViewName { get; set; }
		
		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public virtual string IdFieldName { get; set; } //nom du champ Id dans la base

		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public virtual string DisplayFieldName { get; set; } //nom du champ utilisé pour afficher l'info à l'utilisateur dans les combos et quickSearch

		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public virtual string SystemIconFieldName { get; set; } //nom du champ utilisé pour afficher une image système représentant l'enregistrement
		
		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public virtual string IconUrlFieldName { get; set; } //nom du champ utilisé pour afficher une image depuis une url représentant l'enregistrement
		
		[StringLength(MagicEntityConsts.MaxIdFieldNameLength)]
		public virtual string ImageFieldName { get; set; } //nom du champ utilisé pour afficher une image base64 ou Bytearray représentant la photo ou l'image principale de l'enregistrement

		public virtual string DefaultSelectSql { get; set; }
		
		public virtual bool AllowInsert { get; set; }
		
		public virtual bool AllowUpdate { get; set; }
		
		public virtual bool AllowDelete { get; set; }
		
		public virtual bool AllowOData { get; set; }
		
		public virtual bool AutoGenCrudSql { get; set; }
		
		public virtual string InsertSql { get; set; }
		
		public virtual string UpdateSql { get; set; }
		
		public virtual string DeleteSql { get; set; }
		
		public virtual bool IsDefaultSelectSqlSP { get; set; }
		
		public virtual bool IsInsertSqlSP { get; set; }
		
		public virtual bool IsUpdateSqlSP { get; set; }
		
		public virtual bool IsDeleteSqlSP { get; set; }
		
		[StringLength(MagicEntityConsts.MaxInsertIdGeneratorIdLength)]
		public virtual string InsertIdGeneratorId { get; set; }
		
		public virtual string CrudIgnoreFields { get; set; }
		
		public virtual string InsertOnlyIgnoreFields { get; set; }
		
		public virtual string UpdateOnlyIgnoreFields { get; set; }
		
		public virtual string AutoGenCrudSelectSql { get; set; }

		
		
		//Mobile information
		
		public virtual bool EnableForMobile { get; set; }
		
		public virtual bool ReadOnlyInMobile { get; set; }
		
		public virtual bool EnableOfflineMode { get; set; }

		
		public virtual bool UseCustomHelp { get; set; }
		
		[StringLength(MagicEntityConsts.MaxCustomHelpUrlLength)]
		public virtual string CustomHelpUrl { get; set; }
		
		public virtual bool IsActive { get; set; }

		/// <summary>
		///Définit si l'entité gère le multitenant lors des requetes en filtrant les demandes suivant l'id tenant actif sur la colonne TenantId
		/// </summary>
		public virtual bool MayHaveTenant { get; set; }
		
		public virtual bool IsFullAudited { get; set; }
		
		public virtual bool TrackChangesHistory { get; set; }
		
		public virtual bool IsHostEntity { get; set; }
		
		public virtual bool DisableCrossSiteAccess { get; set; }
		
		public virtual bool UseConfidentiality { get; set; }
		
		[StringLength(MagicEntityConsts.MaxConfidentialityFieldNameLength)]
		public virtual string ConfidentialityFieldName { get; set; }

		public virtual bool UseSecurityLevel { get; set; }
		public virtual int? DefaultSecurityLevel { get; set; }
		
		[StringLength(MagicEntityConsts.MaxSecurityLevelFieldNameLength)]
		public virtual string SecurityLevelFieldName { get; set; }


		//Gestion des permissions		
		public virtual string AccessPermissionName { get; set; }
		public virtual string CreatePermissionName { get; set; }
		public virtual string EditPermissionName { get; set; }
		public virtual string DeletePermissionName { get; set; }


		public virtual bool UseSelectedFieldsOnly { get; set; }
		public virtual string PreviewHtmlTemplate { get; set; }

		[Required]
		public virtual string SolutionId { get; set; }
		
        [ForeignKey("SolutionId")]
		public MagicSolution SolutionFk { get; set; }
		
		public virtual string DataOwnerShipId { get; set; }
		
        [ForeignKey("DataOwnerShipId")]
		public MagicDataOwnerShip DataOwnerShipFk { get; set; }
		
		public virtual string DefaultFormId { get; set; }
		
        		
		public virtual string DefaultPreviewReportId { get; set; }
		
       		
		public virtual string DefaultQuickCreateFormId { get; set; }
	
     
		
    }
}