using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityFieldGroupForEditOutput
    {
		public CreateOrEditMagicEntityFieldGroupDto MagicEntityFieldGroup { get; set; }

		public string MagicEntityName { get; set;}


    }
}