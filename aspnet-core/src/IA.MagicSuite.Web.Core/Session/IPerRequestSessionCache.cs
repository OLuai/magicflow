using System.Threading.Tasks;
using IA.MagicSuite.Sessions.Dto;

namespace IA.MagicSuite.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
