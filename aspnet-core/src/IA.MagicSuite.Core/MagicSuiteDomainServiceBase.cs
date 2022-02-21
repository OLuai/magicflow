using Abp.Domain.Services;

namespace IA.MagicSuite
{
    public abstract class MagicSuiteDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected MagicSuiteDomainServiceBase()
        {
            LocalizationSourceName = MagicSuiteConsts.LocalizationSourceName;
        }
    }
}
