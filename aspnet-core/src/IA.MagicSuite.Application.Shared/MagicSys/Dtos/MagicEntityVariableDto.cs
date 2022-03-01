
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicEntityVariableDto : EntityDto<string>
    {

		public  string Name { get; set; }

		public  string DisplayName { get; set; }

		public  string LocalizationName { get; set; }

		public  string EntityId { get; set; }

		public  string DataTypeId { get; set; }

		public  string Description { get; set; }

		public  bool IsActive { get; set; }
		public  bool IsRequired { get; set; }

		public  string Regex { get; set; } //regex de validation de la valeur de la variable

		public  string ValidationRules { get; set; } //règle de validation pour la qualité de la valeur (Généralement utilisée pour la validation en comparaison à la valeur des autres variables de l'entité)		
		public  string DefaultValue { get; set; }


	}
}