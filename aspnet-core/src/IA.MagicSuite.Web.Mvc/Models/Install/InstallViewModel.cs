using System.Collections.Generic;
using Abp.Localization;
using IA.MagicSuite.Install.Dto;

namespace IA.MagicSuite.Web.Models.Install
{
    public class InstallViewModel
    {
        public List<ApplicationLanguage> Languages { get; set; }

        public AppSettingsJsonDto AppSettingsJson { get; set; }
    }
}
