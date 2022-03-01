﻿using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicAppTypesInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string SystemIconFilter { get; set; }



    }
}