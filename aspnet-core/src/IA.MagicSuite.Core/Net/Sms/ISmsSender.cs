using System.Threading.Tasks;

namespace IA.MagicSuite.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}