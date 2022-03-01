
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppVersionHistoryItemCategoryDto : EntityDto<string>
    {
		public string Code { get; set; }

		public string Name { get; set; }

		public string Description { get; set; }


		 public int? LanguageId { get; set; }

		 
    }
}