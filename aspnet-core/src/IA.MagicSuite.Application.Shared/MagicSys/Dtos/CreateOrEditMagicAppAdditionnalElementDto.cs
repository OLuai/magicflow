
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppAdditionnalElementDto : EntityDto<string>
    {

		 public string AppId { get; set; }
		 
		 
    }
}