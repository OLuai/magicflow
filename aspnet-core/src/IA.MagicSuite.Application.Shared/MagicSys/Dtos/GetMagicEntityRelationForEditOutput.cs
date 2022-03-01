using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityRelationForEditOutput
	{
		public CreateOrEditMagicEntityRelationDto MagicEntityRelation { get; set; }

		public string MagicEntityName { get; set;}		

		public string MagicChildEntityName { get; set;}		


    }
}