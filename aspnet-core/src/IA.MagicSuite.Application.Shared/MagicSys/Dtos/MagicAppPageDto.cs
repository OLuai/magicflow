
using System;
using Abp.Application.Services.Dto;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicAppPageDto : EntityDto<long>
    {

		 public string AppId { get; set; }

		 		 public string EntityId { get; set; }

		 		 public string PageId { get; set; }

		 
    }
}