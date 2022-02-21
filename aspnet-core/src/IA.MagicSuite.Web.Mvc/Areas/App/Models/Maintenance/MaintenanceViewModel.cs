using System.Collections.Generic;
using IA.MagicSuite.Caching.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Maintenance
{
    public class MaintenanceViewModel
    {
        public IReadOnlyList<CacheDto> Caches { get; set; }
    }
}