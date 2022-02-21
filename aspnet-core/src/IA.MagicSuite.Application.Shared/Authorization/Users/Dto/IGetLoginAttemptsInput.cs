using Abp.Application.Services.Dto;

namespace IA.MagicSuite.Authorization.Users.Dto
{
    public interface IGetLoginAttemptsInput: ISortedResultRequest
    {
        string Filter { get; set; }
    }
}