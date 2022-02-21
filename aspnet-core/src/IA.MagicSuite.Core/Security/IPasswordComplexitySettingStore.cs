using System.Threading.Tasks;

namespace IA.MagicSuite.Security
{
    public interface IPasswordComplexitySettingStore
    {
        Task<PasswordComplexitySetting> GetSettingsAsync();
    }
}
