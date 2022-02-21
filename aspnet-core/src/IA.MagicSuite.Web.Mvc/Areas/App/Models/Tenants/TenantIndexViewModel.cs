using System.Collections.Generic;
using IA.MagicSuite.Editions.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Tenants
{
    public class TenantIndexViewModel
    {
        public List<SubscribableEditionComboboxItemDto> EditionItems { get; set; }
    }
}