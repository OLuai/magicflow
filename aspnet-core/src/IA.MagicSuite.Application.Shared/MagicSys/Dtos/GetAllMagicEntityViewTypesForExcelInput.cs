﻿using Abp.Application.Services.Dto;
using System;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class GetAllMagicEntityViewTypesForExcelInput
    {
		public string Filter { get; set; }

		public string NameFilter { get; set; }

		public string DescriptionFilter { get; set; }

		public string SystemIconFilter { get; set; }

		public string IconUrlFilter { get; set; }



    }
}