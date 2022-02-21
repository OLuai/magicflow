using Abp.Authorization;
using IA.MagicSuite.Authorization.Roles;
using IA.MagicSuite.Authorization.Users;

namespace IA.MagicSuite.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
