using System.Collections.Generic;
using IA.MagicSuite.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace IA.MagicSuite.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
