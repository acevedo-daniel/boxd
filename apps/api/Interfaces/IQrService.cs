using e_commerce_api.Models;

namespace e_commerce_api.Interfaces
{
    public interface IQrService
    {
        Task<QrToken> GenerateQrTokenAsync(int expirationMinutes = 10);
        byte[] GenerateQrCode(string url);
        Task<QrToken?> ValidateQrTokenAsync(string token);
        Task<bool> UseQrTokenAsync(string token, string? usedBy = null);
        string GetQrTokenUrl(string token);
    }
} 