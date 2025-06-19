using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services
{
    public class AccountService : IAccountService
    {
        private readonly IResetPasswordEmailRepository _resetPassword;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountService(
            IResetPasswordEmailRepository resetPassword,
            SignInManager<User> signInManager,
            UserManager<User> userManager
            )
        {
            _resetPassword = resetPassword;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<(bool Succeeded, string? ErrorMessage)> ChangeUserPasswordAsync(string userId, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return (false, "Nie znaleziono użytkownika.");
            }

            var isSameAsCurrent = await _userManager.CheckPasswordAsync(user, newPassword);
            if (isSameAsCurrent)
            {
                return (false, "Nowe hasło musi różnić się od obecnego.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var changePasswordResult = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (!changePasswordResult.Succeeded)
            {
                return (false, "Nie udało się zmienić hasła. Upewnij się, że nowe hasło spełnia wymagania.");
            }

            user.LastPasswordChange = DateTime.Now;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return (false, "Nie udało się zaktualizować danych użytkownika.");
            }

            return (true, null);
        }

        public async Task ForgotPassword(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            await _resetPassword.SendResetPasswordEmail(user.Id, token);
        }

        public async Task<SignInResult> PasswordSignInAsync(string username, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(username, password, isPersistent: true, lockoutOnFailure: true);
            return result;
        }
    }
}