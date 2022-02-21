using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using IA.MagicSuite.Authorization.Users;
using IA.MagicSuite.MultiTenancy;

namespace IA.MagicSuite.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}