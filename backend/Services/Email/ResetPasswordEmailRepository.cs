using backend.Interfaces;
using backend.Models.Entities;
using backend.Services.EmailBody;
using Microsoft.AspNetCore.Identity;
using Serilog;

namespace backend.Services.Email
{
    public class ResetPasswordEmailRepository : IResetPasswordEmailRepository
    {
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly UserManager<User> _userManager;
        private readonly string? _redirectUrl;

        public ResetPasswordEmailRepository(
            IConfiguration configuration,
            IEmailService emailService,
            UserManager<User> userManager)
        {
            _configuration = configuration;
            _emailService = emailService;
            _userManager = userManager;
            _redirectUrl = _configuration["EmailSettings:RedirectUrl"];
        }


        public async Task SendResetPasswordEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var name = $"{user.FirstName} {user.LastName}".Trim();

                var email = user.Email ?? string.Empty;

                var link = $"{_redirectUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";

                var subject = "Resetowanie hasła w systemie";

                var body = new ResetPasswordEmailBody();
                var emailBody = body.GenerateResetPasswordEmailBody(name, link);

                if (!string.IsNullOrEmpty(email))
                {
                    await _emailService.SendEmail(email, subject, emailBody);

                    Log.Information($"Wysłano link resetowania hasła do: {email}.");
                }
            }
        }
    }
}