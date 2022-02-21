using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_FlowExecutions")]
    [Audited]
    public class MagicFlowExecution : FullAuditedEntity<long> , IMayHaveTenant
    {

		public int? TenantId { get; set; }	
		

		[Required]
		public virtual string FlowId { get; set; } //Identifiant du flow utilisé comme base pour l'exécution en cours

		[ForeignKey("FlowId")]
		public MagicFlow MagicFlowFk { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string FlowJSON { get; set; }//JSON du flow uniquement renseigné pour les flows qui ne sont pas enregistré dans la base (ex: flow des Pages). Vider lorsque le flow est terminé


		public virtual string EntityId { get; set; } //liaison à une entité pour identifier à quel objet/table de données est rattaché le flow actuel si c'est le cas.

		[ForeignKey("EntityId")]
		public MagicEntity MagicEntityFk { get; set; }
		public virtual string EntityDataId { get; set; } //Identifiant de l'enregistrement dans la table de l'entité

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)		
		public virtual string InputData { get; set; } //Données et variables utiles au flow pour son exécution. Objet JS stringify en JSON
		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)	
		public virtual string OutputData { get; set; } //Données résultat de l'exécution du flow. Objet JS stringify en JSON
		public virtual bool FlowDataIsConfidential { get; set; } //true si le flow utilise des données confidentitielle ou à caractère personnel. Dans ce cas, les données du InputData et OutputData doivent être encryptées pendant le traitement et supprimées lorsque le flow est terminé


		[Required]
		public virtual string StatusId { get; set; } //Identifiant du statut du flow (PENDING, CANCELED, DONE, DONE_BY_DEADLINE, ERROR)
		[ForeignKey("StatusId")]
		public MagicFlowExecutionStatus MagicFlowExecutionStatusFk { get; set; }

		public virtual string LastActionId { get; set; } //identifiant de la dernière action du flow exécutée. Très utile lorsqu'il y'a erreur, que le service a été intérompu ou que l'action est en cours

		//Champs chrono
		public virtual DateTime Deadline { get; set; } //Optionel. Utile seulement si le flow lui même a une échéance (délai) d'exécution maximum. 
		public virtual DateTime StartedAt { get; set; } //Date et heure de début d'execution 
		public virtual DateTime EndedAt { get; set; } //Date et heure de fin d'execution 

		[StringLength(4000)]
		public virtual string ErrorMessage { get; set; } //Message d'ereur lorsqu'il y a une erreur lors du déroulement du flow
	}
}