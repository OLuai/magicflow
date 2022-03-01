using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetMagicAppVersionHistoryByAppIdAndVersionNameInput
    {
		public string AppId { get; set; }

		public string VersionName { get; set;}


    }
}