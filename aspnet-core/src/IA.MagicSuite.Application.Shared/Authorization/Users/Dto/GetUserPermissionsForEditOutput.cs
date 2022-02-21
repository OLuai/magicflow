using System.Collections.Generic;
using IA.MagicSuite.Authorization.Permissions.Dto;

namespace IA.MagicSuite.Authorization.Users.Dto
{
    public class GetUserPermissionsForEditOutput
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}