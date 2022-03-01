using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppVersionHistoryItemCategoryForEditOutput
    {
		public CreateOrEditMagicAppVersionHistoryItemCategoryDto MagicAppVersionHistoryItemCategory { get; set; }

		public string ApplicationLanguageName { get; set;}


    }
}