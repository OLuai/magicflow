
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppStatusDto : EntityDto<long>
    {
		public int NumericCode { get; set; }

		public string Name { get; set; }

		public string SystemIcon { get; set; }

		public string IconUrl { get; set; }

		public bool IsActive { get; set; }



    }
}