using System.Collections.Generic;
using IA.MagicSuite.Authorization.Permissions.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }

        List<string> GrantedPermissionNames { get; set; }
    }
}