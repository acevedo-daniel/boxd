using e_commerce_api.DTOs.Auth;
using e_commerce_api.Models;

namespace e_commerce_api.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        string GenerateJwtToken(User user);
        bool VerifyPassword(string password, string passwordHash, string passwordSalt);
        (string hash, string salt) HashPassword(string password);
        Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
} 