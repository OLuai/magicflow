using Abp.Auditing;
using IA.MagicSuite.Configuration.Dto;

namespace IA.MagicSuite.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}