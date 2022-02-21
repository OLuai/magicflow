using Abp.AutoMapper;
using IA.MagicSuite.Organizations.Dto;

namespace IA.MagicSuite.Models.Users
{
    [AutoMapFrom(typeof(OrganizationUnitDto))]
    public class OrganizationUnitModel : OrganizationUnitDto
    {
        public bool IsAssigned { get; set; }
    }
}