
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppStatusDto : EntityDto<long?>
    {

		public int NumericCode { get; set; }
		
		
		[Required]
		[StringLength(MagicAppStatusConsts.MaxNameLength, MinimumLength = MagicAppStatusConsts.MinNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicAppStatusConsts.MaxSystemIconLength, MinimumLength = MagicAppStatusConsts.MinSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicAppStatusConsts.MaxIconUrlLength, MinimumLength = MagicAppStatusConsts.MinIconUrlLength)]
		public string IconUrl { get; set; }
		
		
		public bool IsActive { get; set; }
		
		

    }
}