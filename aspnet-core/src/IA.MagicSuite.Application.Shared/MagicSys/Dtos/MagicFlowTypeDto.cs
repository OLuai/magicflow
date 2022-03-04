using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IA.MagicSuite.MagicSys.Dtos
{
    public class MagicFlowTypeDto : EntityDto<string>
    {
        [Required]
        [StringLength(MagicPageTypeConsts.MaxNameLength)]
        public string Name { get; set; }

    }
}
