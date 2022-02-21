using Abp.AutoMapper;
using IA.MagicSuite.MultiTenancy.Dto;

namespace IA.MagicSuite.Web.Models.TenantRegistration
{
    [AutoMapFrom(typeof(RegisterTenantOutput))]
    public class TenantRegisterResultViewModel : RegisterTenantOutput
    {
        public string TenantLoginAddress { get; set; }
    }
}