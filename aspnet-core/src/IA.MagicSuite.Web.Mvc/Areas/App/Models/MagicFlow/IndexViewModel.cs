using Abp.Application.Services.Dto;
using IA.MagicSuite.MagicSys.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IA.MagicSuite.Web.Areas.App.Models.MagicFlow
{
    public class IndexViewModel
    {
        public ListResultDto<MagicFlowTypeDto> FlowTypes { get; set; }
    }
}
