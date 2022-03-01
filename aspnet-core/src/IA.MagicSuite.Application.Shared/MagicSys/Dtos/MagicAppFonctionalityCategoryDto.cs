
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppFonctionalityCategoryDto : EntityDto<string>
    {
		public string Name { get; set; }

		public string Description { get; set; }

		public bool IsActive { get; set; }

		public bool IsOptional { get; set; }


		 public string AppId { get; set; }

		 
    }
}