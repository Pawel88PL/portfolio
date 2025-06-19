using backend.Models.Entities;

namespace backend.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateJwtTokenForUser(User user);
    }
}