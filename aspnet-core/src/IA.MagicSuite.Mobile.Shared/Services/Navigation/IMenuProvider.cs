using System.Collections.Generic;
using MvvmHelpers;
using IA.MagicSuite.Models.NavigationMenu;

namespace IA.MagicSuite.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}