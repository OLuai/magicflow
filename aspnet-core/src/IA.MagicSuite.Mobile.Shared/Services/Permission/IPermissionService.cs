namespace IA.MagicSuite.Services.Permission
{
    public interface IPermissionService
    {
        bool HasPermission(string key);
    }
}