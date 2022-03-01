
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppVersionHistoryItemDto : EntityDto<long?>
    {

		[Required]
		[StringLength(MagicAppVersionHistoryItemConsts.MaxNameLength, MinimumLength = MagicAppVersionHistoryItemConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		public string Description { get; set; }
		
		
		 public string AppId { get; set; }
		 
		 		 public long VersionHistoryId { get; set; }
		 
		 		 public string CategoryId { get; set; }
		 
		 
    }
}