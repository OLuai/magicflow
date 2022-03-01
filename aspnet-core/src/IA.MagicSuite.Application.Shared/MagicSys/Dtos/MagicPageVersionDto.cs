
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicPageVersionDto : EntityDto<long>
    {
		public string Name { get; set; }
		public string PageJSON { get; set; }				
		public string Description { get; set; }
		public string PageId { get; set; }


	}
}