using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityVariableForEditOutput
    {
		public CreateOrEditMagicEntityVariableDto MagicEntityVariable { get; set; }

		public string MagicEntityName { get; set;}

		public string MagicEntityFieldDataTypeName { get; set;}


    }
}