namespace IA.MagicSuite.Configuration
{
    public interface IAppConfigurationWriter
    {
        void Write(string key, string value);
    }
}
