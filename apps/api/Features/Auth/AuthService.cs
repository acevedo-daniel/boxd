using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Boxd.Api.Data;
using Boxd.Api.Features.Auth.Authorization;
using Boxd.Api.Features.Auth.Contracts;
using Boxd.Api.Infrastructure.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Boxd.Api.Features.Auth;

public sealed class AuthService(
    ApplicationDbContext context,
    IConfiguration configuration,
    IPasswordHasher<User> passwordHasher)
{
    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(candidate => candidate.Username == loginDto.Username);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var passwordVerification = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);
        if (passwordVerification == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        if (passwordVerification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, loginDto.Password);
            await context.SaveChangesAsync();
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        if (registerDto.Password != registerDto.ConfirmPassword)
        {
            throw new ArgumentException("Passwords do not match");
        }

        if (await context.Users.AnyAsync(user => user.Username == registerDto.Username))
        {
            throw new ArgumentException("Username already exists");
        }

        if (await context.Users.AnyAsync(user => user.Email == registerDto.Email))
        {
            throw new ArgumentException("Email already exists");
        }

        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            Role = UserRoles.Customer
        };
        user.PasswordHash = passwordHasher.HashPassword(user, registerDto.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var jwtSettings = ApiConfiguration.GetJwtSettings(configuration);
        var expiresAt = DateTime.UtcNow.AddHours(jwtSettings.ExpirationHours);

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user, jwtSettings, expiresAt),
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            ExpiresAt = expiresAt
        };
    }

    private static string GenerateJwtToken(User user, JwtSettings jwtSettings, DateTime expiresAt)
    {
        var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            ]),
            Expires = expiresAt,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings.Issuer,
            Audience = jwtSettings.Audience
        };

        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }
}
