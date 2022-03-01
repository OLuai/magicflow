
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicEntityVariableDto : EntityDto<string>
    {
		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public  string Name { get; set; }

		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public  string DisplayName { get; set; }

		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public  string LocalizationName { get; set; }

		[Required]
		public  string EntityId { get; set; }

		[Required]
		public  string DataTypeId { get; set; }
		
		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public  string Description { get; set; }

		public  bool IsActive { get; set; }
		public  bool IsRequired { get; set; }		

		[StringLength(MagicEntityFieldConsts.MaxRegexLength)]
		public  string Regex { get; set; } //regex de validation de la valeur de la variable

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public  string ValidationRules { get; set; } //règle de validation pour la qualité de la valeur (Généralement utilisée pour la validation en comparaison à la valeur des autres variables de l'entité)

		[StringLength(int.MaxValue)] //int.MaxValue permet de créer un nvarchar(Max)
		public  string DefaultValue { get; set; }


	}
}