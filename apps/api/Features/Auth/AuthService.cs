using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Boxd.Api.Data;
using Boxd.Api.Features.Auth.Contracts;
using Boxd.Api.Infrastructure.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Boxd.Api.Features.Auth
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(GetJwtExpirationHours());

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                throw new ArgumentException("Passwords do not match");
            }

            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                throw new ArgumentException("Username already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new ArgumentException("Email already exists");
            }

            var (passwordHash, passwordSalt) = HashPassword(registerDto.Password);

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(GetJwtExpirationHours());

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        public string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(GetRequiredJwtSetting("SecretKey"));

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(GetJwtExpirationHours()),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = GetRequiredJwtSetting("Issuer"),
                Audience = GetRequiredJwtSetting("Audience")
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool VerifyPassword(string password, string passwordHash, string passwordSalt)
        {
            using var hmac = new HMACSHA512(Convert.FromBase64String(passwordSalt));
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(Convert.FromBase64String(passwordHash));
        }

        public (string hash, string salt) HashPassword(string password)
        {
            using var hmac = new HMACSHA512();
            var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            var passwordSalt = Convert.ToBase64String(hmac.Key);
            return (passwordHash, passwordSalt);
        }

        private string GetRequiredJwtSetting(string key)
        {
            var value = _configuration[$"JwtSettings:{key}"];
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"Configuration key 'JwtSettings:{key}' is required.");
            }

            return value;
        }

        private int GetJwtExpirationHours()
        {
            var configuredValue = GetRequiredJwtSetting("ExpirationHours");
            if (!int.TryParse(configuredValue, out var expirationHours) || expirationHours <= 0)
            {
                throw new InvalidOperationException("Configuration key 'JwtSettings:ExpirationHours' must be a positive integer.");
            }

            return expirationHours;
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }

        public async Task ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
                return; // No revelar si el email existe o no

            var token = GenerateSecureToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(30);

            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = expiresAt,
                IsUsed = false
            };
            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            var appUrl = _configuration["AppSettings:BaseUrl"] ?? "https://localhost:7000";
            var resetLink = $"{appUrl}/reset-password?token={token}";
            var subject = "Recuperación de contraseña";
            var body = $"<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><p><a href='{resetLink}'>Restablecer contraseña</a></p><p>Este enlace expirará en 30 minutos.</p>";

            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmPassword)
                throw new ArgumentException("Las contraseñas no coinciden");

            var resetToken = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == resetPasswordDto.Token);

            if (resetToken == null || resetToken.IsUsed || resetToken.ExpiresAt < DateTime.UtcNow)
                throw new ArgumentException("Token inválido o expirado");

            var user = resetToken.User;
            if (user == null)
                throw new ArgumentException("Usuario no encontrado");

            var (hash, salt) = HashPassword(resetPasswordDto.NewPassword);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;

            resetToken.IsUsed = true;
            await _context.SaveChangesAsync();
        }
    }
}
