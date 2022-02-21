using Abp.AutoMapper;
using IA.MagicSuite.Authorization.Roles.Dto;
using IA.MagicSuite.Web.Areas.App.Models.Common;

namespace IA.MagicSuite.Web.Areas.App.Models.Roles
{
    [AutoMapFrom(typeof(GetRoleForEditOutput))]
    public class CreateOrEditRoleModalViewModel : GetRoleForEditOutput, IPermissionsEditViewModel
    {
        public bool IsEditMode => Role.Id.HasValue;
    }
}