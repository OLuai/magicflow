using System.Reflection;
using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite.Localization
{
    public static class MagicSuiteLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(
                    MagicSuiteConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(MagicSuiteLocalizationConfigurer).GetAssembly(),
                        "IA.MagicSuite.Localization.MagicSuite"
                    )
                )
            );
        }
    }
}