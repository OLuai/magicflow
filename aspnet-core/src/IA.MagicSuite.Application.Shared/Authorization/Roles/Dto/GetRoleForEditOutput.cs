using System.Collections.Generic;
using IA.MagicSuite.Authorization.Permissions.Dto;

namespace IA.MagicSuite.Authorization.Roles.Dto
{
    public class GetRoleForEditOutput
    {
        public RoleEditDto Role { get; set; }

        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}