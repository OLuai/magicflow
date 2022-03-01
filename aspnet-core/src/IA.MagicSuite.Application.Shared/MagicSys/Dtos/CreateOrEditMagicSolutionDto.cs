
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class CreateOrEditMagicSolutionDto : EntityDto<string>
    {

		[Required]
		[StringLength(MagicSolutionConsts.MaxNameLength)]
		public string Name { get; set; }
		
		
		[StringLength(MagicSolutionConsts.MaxDescriptionLength)]
		public string Description { get; set; }
		
		
		public bool IsActive { get; set; }
		
		
		[StringLength(MagicSolutionConsts.MaxColorOrClassNameLength)]
		public string ColorOrClassName { get; set; }
		
		
		[StringLength(MagicSolutionConsts.MaxSystemIconLength)]
		public string SystemIcon { get; set; }
		
		
		[StringLength(MagicSolutionConsts.MaxIconUrlLength)]
		public string IconUrl { get; set; }
				
		 public long? OwnerId { get; set; }
		 
		 public string VendorId { get; set; }

		public bool AppsAreOnlyEditableByAppOwner { get; set; }
	}
}