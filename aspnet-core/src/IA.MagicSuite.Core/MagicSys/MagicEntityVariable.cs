using IA.MagicSuite.MagicSys;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using Abp.Auditing;

namespace IA.MagicSuite.MagicSys
{
	[Table("IASYS_EntityVariables")]
    [Audited]
    public class MagicEntityVariable : FullAuditedEntity<string> , IMayHaveTenant, IPassivable 
    {
		public MagicEntityVariable()
		{
			IsActive = true;
			IsRequired = true;
			DataTypeId = "SMALLTEXT";
		}

		public int? TenantId { get; set; }

		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public virtual string Name { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public virtual string DisplayName { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public virtual string LocalizationName { get; set; }

		
		//[StringLength(MagicSolutionConsts.MaxNameLength)]
		//public virtual string CategoryName { get; set; }//nom de la catégorie pour le regroupement des variables sous des Groupes dans le UI automatisé lorsque nécessaire
		
		[Required]
		public virtual string EntityId { get; set; }

		[ForeignKey("EntityId")]
		public MagicEntity EntityFk { get; set; }

		[Required]
		public virtual string DataTypeId { get; set; }

		[ForeignKey("DataTypeId")]
		public MagicEntityFieldDataType EntityFieldDataTypeFk { get; set; }

		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public virtual string Description { get; set; }
					
		public virtual bool IsActive { get; set; }
		public virtual bool IsRequired { get; set; }
		//public virtual bool ReadOnly { get; set; }
		

		[StringLength(MagicEntityFieldConsts.MaxRegexLength)]
		public virtual string Regex { get; set; } //regex de validation de la valeur de la variable

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string ValidationRules { get; set; }	//règle de validation pour la qualité de la valeur (Généralement utilisée pour la validation en comparaison à la valeur des autres variables de l'entité)
		

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public virtual string DefaultValue { get; set; } //valeur par défaut pour la création d'un nouvel enregistrement (peut être une expression ou un fonction).

		//[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		//public virtual string CalculationFormula { get; set; } //formule de calcule et autre de la variable (peut être une expression ou un fonction).

		////UI informations
		//public virtual bool EndUserVisible { get; set; }//permet d'afficher dans le ui pour la saisie par l'utilisateur final

		//public virtual string ControlId { get; set; }
		//[ForeignKey("ControlId")]
		//public MagicControl ControlFk { get; set; }
		//public virtual string ControlDataSourceName { get; set; } //source de données lorsque la variable va prendre une liste de valeur depuis un entity		
		
		//public virtual string ControlKeyFieldName { get; set; } //nom du champ id dans le controle utilisé pour retourner la valeur
		//public virtual string ControlDisplayNameFieldName { get; set; } //nom du champ id dans le controle utilisé pour la valeur affichée

		//[StringLength(int.MaxValue)]
		//public virtual string ControlValues { get; set; } //lorsque la liste des valeurs doit être saisie
		
		//public virtual int? ControlOrderNumber { get; set; } //numéro d'ordre pour positionner les variables dans le UI

	}
}