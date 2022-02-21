using Abp.AutoMapper;
using IA.MagicSuite.Authorization.Users;
using IA.MagicSuite.Authorization.Users.Dto;
using IA.MagicSuite.Web.Areas.App.Models.Common;

namespace IA.MagicSuite.Web.Areas.App.Models.Users
{
    [AutoMapFrom(typeof(GetUserPermissionsForEditOutput))]
    public class UserPermissionsEditViewModel : GetUserPermissionsForEditOutput, IPermissionsEditViewModel
    {
        public User User { get; set; }
    }
}