using Abp.Configuration;
using Abp.Net.Mail;
using Abp.Net.Mail.Smtp;
using Abp.Runtime.Security;

namespace IA.MagicSuite.Net.Emailing
{
    public class MagicSuiteSmtpEmailSenderConfiguration : SmtpEmailSenderConfiguration
    {
        public MagicSuiteSmtpEmailSenderConfiguration(ISettingManager settingManager) : base(settingManager)
        {

        }

        public override string Password => SimpleStringCipher.Instance.Decrypt(GetNotEmptySettingValue(EmailSettingNames.Smtp.Password));
    }
}