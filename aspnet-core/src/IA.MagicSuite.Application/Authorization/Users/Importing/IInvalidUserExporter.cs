using System.Collections.Generic;
using IA.MagicSuite.Authorization.Users.Importing.Dto;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
