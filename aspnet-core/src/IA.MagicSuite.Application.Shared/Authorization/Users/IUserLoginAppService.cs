using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Authorization.Users.Dto;

namespace IA.MagicSuite.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<PagedResultDto<UserLoginAttemptDto>> GetUserLoginAttempts(GetLoginAttemptsInput input);
    }
}
