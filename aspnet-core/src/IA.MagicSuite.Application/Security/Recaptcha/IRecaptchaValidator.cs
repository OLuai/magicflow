using System.Threading.Tasks;

namespace IA.MagicSuite.Security.Recaptcha
{
    public interface IRecaptchaValidator
    {
        Task ValidateAsync(string captchaResponse);
    }
}