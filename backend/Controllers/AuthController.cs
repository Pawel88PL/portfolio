using System.Security.Claims;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IAccountService _accountService;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;

        public AuthController(
            AppDbContext context,
            IAccountService accountService,
            IConfiguration configuration,
            ITokenService tokenService,
            UserManager<User> userManager)
        {
            _context = context;
            _accountService = accountService;
            _configuration = configuration;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Nieprawidłowe dane wejściowe." });
            }

            var result = await _accountService.ChangeUserPasswordAsync(request.UserId, request.NewPassword);

            if (!result.Succeeded)
            {
                return StatusCode(400, new { message = result.ErrorMessage });
            }

            return Ok();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                var message = "Nie znaleziono użytkownika o podanym adresie e-mail.";
                return NotFound(new { message });
            }

            try
            {
                await _accountService.ForgotPassword(user);
                return Ok();
            }
            catch (Exception ex)
            {
                var message = "Wystąpił błąd podczas wysyłania linku resetującego hasło." + ex.Message;
                Log.Error(message);
                return StatusCode(500, new { message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLoginData)
        {
            string message;

            if (!ModelState.IsValid || userLoginData.UserName == null || userLoginData.Password == null)
            {
                return BadRequest(ModelState);
            }

            // Pobierz użytkownika
            var user = await _userManager.FindByNameAsync(userLoginData.UserName);
            if (user == null)
            {
                message = "Nie znaleziono użytkownika o podanym identyfikatorze.";
                return NotFound(new { message });
            }

            // Próba logowania
            var signInResult = await _accountService.PasswordSignInAsync(userLoginData.UserName!, userLoginData.Password!);

            // Jeśli logowanie nie powiodło się
            if (!signInResult.Succeeded)
            {
                await AddNewLoginAttemptAsync(user, false);

                if (await _userManager.IsLockedOutAsync(user))
                {
                    Log.Information($"Konto {user.UserName} zostało zablokowane na {user.LockoutEnd?.LocalDateTime - DateTime.Now:mm} minut.");

                    message = "Zbyt wiele prób błędnego logowania. Konto zostało zablokowane na 5 minut.";
                    return Unauthorized(new { message });
                }

                Log.Information($"Nieudane logowanie użytkownika {user.UserName}.");

                message = "Podano nieprawidłowe dane logowania.";
                return Unauthorized(new { message });
            }

            Log.Information($"Użytkownik {user.UserName} zalogował się do systemu.");

            await AddNewLoginAttemptAsync(user, true);

            var token = _tokenService.GenerateJwtTokenForUser(user);

            return Ok(new { Token = token });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                var message = "Nie znaleziono użytkownika o podanym adresie e-mail.";
                return NotFound(new { message });
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                var message = "Nie udało się zresetować hasła. <br> " + string.Join(" ", errors);
                return BadRequest(new { message });
            }

            return Ok();
        }

        private async Task AddNewLoginAttemptAsync(User user, bool successful)
        {
            if (successful)
            {
                user.LastSuccessfulLogin = DateTime.Now;
            }
            else
            {
                user.LastFailedLogin = DateTime.Now;
            }

            await _userManager.UpdateAsync(user);
        }
    }
}