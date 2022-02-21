using System.Collections.Generic;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Authorization.Permissions.Dto;
using IA.MagicSuite.Web.Areas.App.Models.Common;

namespace IA.MagicSuite.Web.Areas.App.Models.Roles
{
    public class RoleListViewModel : IPermissionsEditViewModel
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}