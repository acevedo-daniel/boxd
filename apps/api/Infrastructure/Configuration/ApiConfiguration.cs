using System.Text;

namespace Boxd.Api.Infrastructure.Configuration;

public sealed class JwtSettings
{
    public const string SectionName = "JwtSettings";

    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationHours { get; set; }
}

public static class ApiConfiguration
{
    public static string GetRequiredValue(IConfiguration configuration, string key)
    {
        var value = configuration[key];
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException($"Configuration key '{key}' is required. Supply it through User Secrets or environment configuration.");
        }

        return value;
    }

    public static JwtSettings GetJwtSettings(IConfiguration configuration)
    {
        var settings = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();

        if (Encoding.UTF8.GetByteCount(settings.SecretKey) < 32)
        {
            throw new InvalidOperationException("Configuration key 'JwtSettings:SecretKey' must be at least 32 bytes.");
        }

        if (string.IsNullOrWhiteSpace(settings.Issuer))
        {
            throw new InvalidOperationException("Configuration key 'JwtSettings:Issuer' is required.");
        }

        if (string.IsNullOrWhiteSpace(settings.Audience))
        {
            throw new InvalidOperationException("Configuration key 'JwtSettings:Audience' is required.");
        }

        if (settings.ExpirationHours <= 0)
        {
            throw new InvalidOperationException("Configuration key 'JwtSettings:ExpirationHours' must be a positive integer.");
        }

        return settings;
    }

    public static string[] GetAllowedOrigins(IConfiguration configuration)
    {
        var origins = configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?.Select(origin => origin.Trim())
            .ToArray();

        if (origins is not { Length: > 0 }
            || origins.Any(string.IsNullOrWhiteSpace)
            || origins.Any(origin => !Uri.TryCreate(origin, UriKind.Absolute, out _)))
        {
            throw new InvalidOperationException("Configuration key 'AllowedOrigins' must contain at least one absolute origin.");
        }

        return origins;
    }
}
