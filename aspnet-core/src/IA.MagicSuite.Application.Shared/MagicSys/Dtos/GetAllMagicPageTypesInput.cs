﻿using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicPageTypesInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string IconUrlFilter { get; set; }



    }
}