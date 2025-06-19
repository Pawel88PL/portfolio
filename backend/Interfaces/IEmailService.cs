using backend.Models;

namespace backend.Interfaces
{
    public interface IEmailService
    {
        Task<ResponseModel> SendEmail(string to, string subject, string body);
    }
}