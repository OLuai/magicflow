using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_Flows")]
    [Audited]
    public class MagicFlow : FullAuditedEntity<String> , IMayHaveTenant, IPassivable
    {

		public MagicFlow()
		{
			IsActive = true;
			TrackingEnabled = true;
			FlowDataIsConfidential = false;
		}

		public int? TenantId { get; set; }
			

		[Required]
		[StringLength(150)]
		public virtual string Name { get; set; }
		public virtual bool FlowDataIsConfidential { get; set; } //true si le flow utilise des données confidentitielle ou à caractère personnel dans une de ses actions ou comme variable d'entrée. Dans ce cas, les données du InputData et OutputData lors de l'exécution devront être encryptées pendant le traitement et supprimées lorsque le flow est terminé.

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string FlowJSON { get; set; }

		[StringLength(400)]
		public virtual string Description { get; set; }

		public virtual string FlowTypeId { get; set; } //Le type du flow pour filtrer les différents type d'actions disponibles APPROVAL,UI,STANDARD

		[ForeignKey("FlowTypeId")]
		public MagicFlowType MagicFlowTypeFk { get; set; }

		public virtual string SolutionId { get; set; } //liaison à une solution
		
        [ForeignKey("SolutionId")]
		public MagicSolution MagicSolutionFk { get; set; }

		public virtual string EntityId { get; set; } //liaison à une entité

		[ForeignKey("EntityId")]
		public MagicEntity MagicEntityFk { get; set; }

		public virtual bool IsActive { get; set; }
		public virtual bool TrackingEnabled { get; set; } //si true alors chaque flow et action exécutée sera tracquée pour ce flow pour avoir les informations sur les performances et les erreurs

		public virtual string ExecutionPermissionName { get; set; } //nom la permission qui autorise un user à avoir accès au service
	}
}