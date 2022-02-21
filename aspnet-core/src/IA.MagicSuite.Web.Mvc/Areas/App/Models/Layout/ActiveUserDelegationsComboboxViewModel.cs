using System.Collections.Generic;
using IA.MagicSuite.Authorization.Delegation;
using IA.MagicSuite.Authorization.Users.Delegation.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Layout
{
    public class ActiveUserDelegationsComboboxViewModel
    {
        public IUserDelegationConfiguration UserDelegationConfiguration { get; set; }
        
        public List<UserDelegationDto> UserDelegations { get; set; }
    }
}
