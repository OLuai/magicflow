using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityFieldForEditOutput
    {
		public CreateOrEditMagicEntityFieldDto MagicEntityField { get; set; }

		public string MagicEntityName { get; set;}

		public string MagicEntityFieldDataTypeName { get; set;}

		public string MagicEntityFieldRequirementName { get; set;}

		public string MagicEntityName2 { get; set;}

		public string MagicEntityFieldName { get; set;}

		public string MagicEntityFieldName2 { get; set;}

		public string MagicEntityFieldCalculationTypeName { get; set;}

		public string MagicEntityFieldGroupName { get; set;}


    }
}