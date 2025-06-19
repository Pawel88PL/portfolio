using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ChangePasswordRequest
    {
        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public string NewPassword { get; set; } = null!;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

}