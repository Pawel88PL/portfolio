using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Interfaces
{
    public interface IAccountService
    {
        Task<(bool Succeeded, string? ErrorMessage)> ChangeUserPasswordAsync(string userId, string newPassword);
        Task ForgotPassword(User user);
        Task<SignInResult> PasswordSignInAsync(string username, string password);
    }
}