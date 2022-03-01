using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppVersionHistoryForEditOutput
    {
		public CreateOrEditMagicAppVersionHistoryDto MagicAppVersionHistory { get; set; }

		public string MagicAppName { get; set;}


    }
}