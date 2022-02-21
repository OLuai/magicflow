using Abp.Application.Services;
using IA.MagicSuite.Dto;
using IA.MagicSuite.Logging.Dto;

namespace IA.MagicSuite.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
