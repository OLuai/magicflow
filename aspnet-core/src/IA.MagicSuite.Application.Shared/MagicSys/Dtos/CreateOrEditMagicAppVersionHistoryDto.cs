
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppVersionHistoryDto : EntityDto<long?>
    {

		[Required]
		[StringLength(MagicAppVersionHistoryConsts.MaxVersionNameLength, MinimumLength = MagicAppVersionHistoryConsts.MinVersionNameLength)]
		public string VersionName { get; set; }		
		
		public DateTime VersionDate { get; set; }		
		
		 public string AppId { get; set; }

		[StringLength(int.MaxValue)]//cas 1. pour créer un varchar max
		[MaxLength] //cas 2. pour créer un varchar max, j'utilise le 2 cas au cas ou un ne marcherai pas pour un type de base de données spécifique
		public string VersionObject { get; set; }

	}
}