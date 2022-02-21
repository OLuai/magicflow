using System.Threading.Tasks;
using Abp.Application.Services;
using IA.MagicSuite.Install.Dto;

namespace IA.MagicSuite.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}