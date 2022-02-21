using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.Sessions.Dto;

namespace IA.MagicSuite.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
