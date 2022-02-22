using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_FlowExecutionActions")]
    [Audited]
    public class MagicFlowExecutionAction : FullAuditedEntity<long> , IMayHaveTenant
    {
		public int? TenantId { get; set; }	
		

		[Required]
		public virtual long FlowExecutionId { get; set; } //Identifiant du flow en exécution

		[ForeignKey("FlowExecutionId")]
		public MagicFlowExecution MagicFlowExecutionFk { get; set; }		

		public virtual string ActionId { get; set; } //Identifiant de l'action en cours d'exécution.


		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)		
		public virtual string InputData { get; set; } //Données et variables utiles au flow pour son exécution. Objet JS stringify en JSON

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)	
		public virtual string OutputData { get; set; } //Données résultat de l'exécution du flow. Objet JS stringify en JSON
		public virtual bool ActionDataIsConfidential { get; set; } //true si l'action utilise des données confidentitielle ou à caractère personnel. Dans ce cas, les données du InputData et OutputData doivent être encryptées pendant le traitement du flow et supprimées lorsque le flow est terminé (pas supprimer quand l'action est terminée)

		[Required]
		public virtual string StatusId { get; set; } //Identifiant du statut du flow (PENDING, CANCELED, DONE, DONE_BY_DEADLINE, ERROR)
		[ForeignKey("StatusId")]
		public MagicFlowExecutionStatus MagicFlowExecutionStatusFk { get; set; }

		
		//Champs chrono
		public virtual DateTime Deadline { get; set; } //Optionel. Utile seulement si le flow lui même a une échéance (délai) d'exécution maximum. 
		public virtual DateTime StartedAt { get; set; } //Date et heure de début d'execution 
		public virtual DateTime EndedAt { get; set; } //Date et heure de fin d'execution 

		[StringLength(4000)]
		public virtual string ErrorMessage { get; set; } //Message d'ereur lorsqu'il y a une erreur lors du déroulement du flow
	}
}