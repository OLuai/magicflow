using Abp.AutoMapper;
using IA.MagicSuite.MultiTenancy.Dto;

namespace IA.MagicSuite.Web.Models.TenantRegistration
{
    [AutoMapFrom(typeof(EditionsSelectOutput))]
    public class EditionsSelectViewModel : EditionsSelectOutput
    {
    }
}
