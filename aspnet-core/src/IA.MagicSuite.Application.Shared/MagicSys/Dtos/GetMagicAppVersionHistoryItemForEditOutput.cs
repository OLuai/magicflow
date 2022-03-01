using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppVersionHistoryItemForEditOutput
    {
		public CreateOrEditMagicAppVersionHistoryItemDto MagicAppVersionHistoryItem { get; set; }

		public string MagicAppName { get; set;}

		public string MagicAppVersionHistoryVersionName { get; set;}

		public string MagicAppVersionHistoryItemCategoryName { get; set;}


    }
}