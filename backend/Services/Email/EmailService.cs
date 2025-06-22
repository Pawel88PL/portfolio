using System.Net;
using System.Net.Mail;
using backend.Interfaces;
using backend.DTOs;
using Microsoft.Extensions.Options;
using Serilog;

namespace backend.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value ?? throw new ArgumentNullException(nameof(options));
        }

        public async Task<ResponseModel> SendEmail(string to, string subject, string body)
        {
            try
            {
                using var mail = new MailMessage
                {
                    From = new MailAddress(_settings.EmailSender),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mail.To.Add(to);

                using var smtp = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_settings.SmtpUsername, _settings.SmtpPassword),
                    EnableSsl = true
                };

                await smtp.SendMailAsync(mail);

                return new ResponseModel
                {
                    Message = "Email został wysłany.",
                    Success = true
                };
            }
            catch (Exception ex)
            {
                Log.Error(ex, $"Błąd wysyłki e-maila: {subject}");
                return new ResponseModel
                {
                    Message = $"Błąd wysyłki e-maila: {ex.Message}",
                    Success = false
                };
            }
        }
    }
}