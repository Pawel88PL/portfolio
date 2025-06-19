namespace backend.Interfaces
{
    public interface IResetPasswordEmailRepository
    {
        Task SendResetPasswordEmail(string userId, string token);
    }
}