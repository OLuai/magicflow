using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
