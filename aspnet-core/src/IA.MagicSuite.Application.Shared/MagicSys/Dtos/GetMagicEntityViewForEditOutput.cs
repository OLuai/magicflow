using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicEntityViewForEditOutput
    {
		public CreateOrEditMagicEntityViewDto MagicEntityView { get; set; }

		public string MagicEntityName { get; set;}

		public string MagicEntityViewTypeName { get; set;}


    }
}