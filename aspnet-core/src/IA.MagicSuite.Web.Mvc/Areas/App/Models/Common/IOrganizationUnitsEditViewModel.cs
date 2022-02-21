using System.Collections.Generic;
using IA.MagicSuite.Organizations.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Common
{
    public interface IOrganizationUnitsEditViewModel
    {
        List<OrganizationUnitDto> AllOrganizationUnits { get; set; }

        List<string> MemberedOrganizationUnits { get; set; }
    }
}