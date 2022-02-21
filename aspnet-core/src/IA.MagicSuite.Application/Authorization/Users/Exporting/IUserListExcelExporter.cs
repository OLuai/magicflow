using System.Collections.Generic;
using IA.MagicSuite.Authorization.Users.Dto;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}