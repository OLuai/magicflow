using System.Collections.Generic;
using IA.MagicSuite.DynamicEntityProperties.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.DynamicProperty
{
    public class CreateOrEditDynamicPropertyViewModel
    {
        public DynamicPropertyDto DynamicPropertyDto { get; set; }

        public List<string> AllowedInputTypes { get; set; }
    }
}
