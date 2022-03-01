
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppEntityDto : EntityDto<long?>
    {

		 public string AppId { get; set; }
		 
		 		 public string EntityId { get; set; }
		 
		 
    }
}