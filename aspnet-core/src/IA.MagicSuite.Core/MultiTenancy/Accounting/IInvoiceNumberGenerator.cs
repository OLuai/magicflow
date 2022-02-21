using System.Threading.Tasks;
using Abp.Dependency;

namespace IA.MagicSuite.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}