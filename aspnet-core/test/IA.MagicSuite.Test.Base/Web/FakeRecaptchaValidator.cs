using System.Threading.Tasks;
using IA.MagicSuite.Security.Recaptcha;

namespace IA.MagicSuite.Test.Base.Web
{
    public class FakeRecaptchaValidator : IRecaptchaValidator
    {
        public Task ValidateAsync(string captchaResponse)
        {
            return Task.CompletedTask;
        }
    }
}
