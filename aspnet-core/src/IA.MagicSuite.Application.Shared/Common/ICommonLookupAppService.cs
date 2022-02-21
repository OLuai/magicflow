using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Common.Dto;
using IA.MagicSuite.Editions.Dto;

namespace IA.MagicSuite.Common
{
    public interface ICommonLookupAppService : IApplicationService
    {
        Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false);

        Task<PagedResultDto<NameValueDto>> FindUsers(FindUsersInput input);

        GetDefaultEditionNameOutput GetDefaultEditionName();
    }
}