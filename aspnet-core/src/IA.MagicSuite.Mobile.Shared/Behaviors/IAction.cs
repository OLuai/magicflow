using Xamarin.Forms.Internals;

namespace IA.MagicSuite.Behaviors
{
    [Preserve(AllMembers = true)]
    public interface IAction
    {
        bool Execute(object sender, object parameter);
    }
}