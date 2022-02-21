using System.Globalization;

namespace IA.MagicSuite.Localization
{
    public interface IApplicationCulturesProvider
    {
        CultureInfo[] GetAllCultures();
    }
}