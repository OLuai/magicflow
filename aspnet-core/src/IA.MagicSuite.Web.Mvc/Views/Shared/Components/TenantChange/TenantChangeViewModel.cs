using Abp.AutoMapper;
using IA.MagicSuite.Sessions.Dto;

namespace IA.MagicSuite.Web.Views.Shared.Components.TenantChange
{
    [AutoMapFrom(typeof(GetCurrentLoginInformationsOutput))]
    public class TenantChangeViewModel
    {
        public TenantLoginInfoDto Tenant { get; set; }
    }
}