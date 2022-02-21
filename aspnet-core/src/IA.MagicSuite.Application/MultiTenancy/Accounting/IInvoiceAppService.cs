using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using IA.MagicSuite.MultiTenancy.Accounting.Dto;

namespace IA.MagicSuite.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
