using System.Threading.Tasks;
using IA.MagicSuite.Views;
using Xamarin.Forms;

namespace IA.MagicSuite.Services.Modal
{
    public interface IModalService
    {
        Task ShowModalAsync(Page page);

        Task ShowModalAsync<TView>(object navigationParameter) where TView : IXamarinView;

        Task<Page> CloseModalAsync();
    }
}
