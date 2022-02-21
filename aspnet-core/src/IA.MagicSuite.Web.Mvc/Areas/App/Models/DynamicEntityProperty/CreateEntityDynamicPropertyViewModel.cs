using System.Collections.Generic;
using IA.MagicSuite.DynamicEntityProperties.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.DynamicEntityProperty
{
    public class CreateEntityDynamicPropertyViewModel
    {
        public string EntityFullName { get; set; }

        public List<string> AllEntities { get; set; }

        public List<DynamicPropertyDto> DynamicProperties { get; set; }
    }
}
