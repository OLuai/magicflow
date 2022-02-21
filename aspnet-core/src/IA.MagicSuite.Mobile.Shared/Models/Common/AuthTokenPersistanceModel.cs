﻿using System;
using Abp.AutoMapper;
using IA.MagicSuite.Sessions.Dto;

namespace IA.MagicSuite.Models.Common
{
    [AutoMapFrom(typeof(ApplicationInfoDto)),
     AutoMapTo(typeof(ApplicationInfoDto))]
    public class ApplicationInfoPersistanceModel
    {
        public string Version { get; set; }

        public DateTime ReleaseDate { get; set; }
    }
}