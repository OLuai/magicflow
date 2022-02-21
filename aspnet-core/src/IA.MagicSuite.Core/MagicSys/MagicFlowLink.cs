using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_FlowLinks")]
    [Audited]
    public class MagicFlowLink : FullAuditedEntity<long> , IMayHaveTenant, IPassivable
    {

		public MagicFlowLink()
		{
			IsActive = true;
			TrackingEnabled = true;
		}

		public int? TenantId { get; set; }			

		[Required]
		[StringLength(150)]
		public virtual string Name { get; set; }

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string FlowJSON { get; set; }

		[StringLength(400)]
		public virtual string Description { get; set; }

		public virtual string FlowId { get; set; } //Liaison au Flow

		[ForeignKey("FlowId")]
		public MagicFlow MagicFlowFk { get; set; }

		public virtual string ObjectType { get; set; } //liaison à l'objet qui exploite ou lance lance flow		
      
		public virtual string ObjectDataId { get; set; } //liaison à la ligne d'enregistrement de l'objet de type "ObjectType" qui utilise le modèle de flow wpécifié dans "FlowId"

		public virtual bool IsActive { get; set; }
		public virtual bool TrackingEnabled { get; set; } //Override du TrackingEnabled du flow spécifique au link. Si true alors chaque flow et action exécutée sera tracquée pour ce flow pour avoir les informations sur les performances et les erreurs.
		public virtual string ExecutionPermissionName { get; set; } //Permission complémentaire nécessaire pour exécuter le flow depuis cet objet si nécessaire. Nom la permission qui autorise un user à avoir accès au service. N'est pas un override de la permission du flow mais ajoute une permission supplémentaire si la sécurité l'exige ou que le flow n'a pas de permission de base.
	}
}