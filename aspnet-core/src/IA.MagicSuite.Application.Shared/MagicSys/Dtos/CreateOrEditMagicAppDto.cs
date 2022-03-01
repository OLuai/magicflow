
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicAppDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicAppConsts.MaxNameLength, MinimumLength = MagicAppConsts.MinNameLength)]
		public string Name { get; set; }
		
				
		[StringLength(MagicAppConsts.MaxDescriptionLength)]
		public string Description { get; set; }

		[Required]
		public long OwnerId { get; set; }

		[StringLength(MagicAppConsts.MaxActiveVersionLength)]
		public string ActiveVersion { get; set; }
		
		
		[StringLength(MagicAppConsts.MaxColorOrClassNameLength)]
		public string ColorOrClassName { get; set; }
		
		
		public bool UseDefaultIcon { get; set; }
		
		
		[StringLength(MagicAppConsts.MaxSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicAppConsts.MaxIconUrlLength)]
		public string IconUrl { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		public bool IsSystemApp { get; set; }
		
		
		 public string SolutionId { get; set; }
		 
		 		 public string AppTypeId { get; set; }
		 
		 		 public long? AppStatusId { get; set; }
		 
		 
    }
}