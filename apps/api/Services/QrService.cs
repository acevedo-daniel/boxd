using System.Security.Cryptography;
using System.Text;
using e_commerce_api.Data;
using e_commerce_api.Models;
using e_commerce_api.Interfaces;
using Microsoft.EntityFrameworkCore;
using QRCoder;

namespace e_commerce_api.Services
{
    public class QrService : IQrService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public QrService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<QrToken> GenerateQrTokenAsync(int expirationMinutes = 10)
        {
            var token = GenerateSecureToken();

            var qrToken = new QrToken
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                IsUsed = false
            };

            _context.QrTokens.Add(qrToken);
            await _context.SaveChangesAsync();

            return qrToken;
        }

        public byte[] GenerateQrCode(string url)
        {
            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new BitmapByteQRCode(qrCodeData);
            return qrCode.GetGraphic(20);
        }

        public async Task<QrToken?> ValidateQrTokenAsync(string token)
        {
            var qrToken = await _context.QrTokens
                .FirstOrDefaultAsync(qt => qt.Token == token);

            if (qrToken == null)
                return null;

            if (qrToken.IsUsed)
                return null;

            if (qrToken.ExpiresAt < DateTime.UtcNow)
                return null;

            return qrToken;
        }

        public async Task<bool> UseQrTokenAsync(string token, string? usedBy = null)
        {
            var qrToken = await _context.QrTokens
                .FirstOrDefaultAsync(qt => qt.Token == token);

            if (qrToken == null || qrToken.IsUsed || qrToken.ExpiresAt < DateTime.UtcNow)
                return false;

            qrToken.IsUsed = true;

            await _context.SaveChangesAsync();
            return true;
        }

        public string GetQrTokenUrl(string token)
        {
            var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "https://localhost:7000";
            return $"{baseUrl}/api/qr/validate/{token}";
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
} 