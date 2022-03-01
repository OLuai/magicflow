
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppPageDto : EntityDto<long?>
    {

		 public string AppId { get; set; }
		 
		 		 public string EntityId { get; set; }
		 
		 		 public string PageId { get; set; }
		 
		 
    }
}