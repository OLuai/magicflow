using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Authorization.Permissions.Dto;

namespace IA.MagicSuite.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
