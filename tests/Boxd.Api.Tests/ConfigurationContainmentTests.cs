using System.Text.Json;
using Boxd.Api.Infrastructure.Configuration;
using Microsoft.Extensions.Configuration;

namespace Boxd.Api.Tests;

[TestClass]
public sealed class ConfigurationContainmentTests
{
    [TestMethod]
    public void RuntimeConfigurationDoesNotContainSecretsOrSmtpSettings()
    {
        foreach (var fileName in new[] { "appsettings.json", "appsettings.Development.json", "appsettings.Testing.json" })
        {
            using var document = JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, fileName)));
            var root = document.RootElement;

            Assert.IsFalse(root.TryGetProperty("SmtpSettings", out _));

            if (root.TryGetProperty("JwtSettings", out var jwtSettings))
            {
                Assert.IsFalse(jwtSettings.TryGetProperty("SecretKey", out _));
            }

            if (root.TryGetProperty("ConnectionStrings", out var connectionStrings)
                && connectionStrings.TryGetProperty("DefaultConnection", out var connectionString))
            {
                Assert.IsTrue(string.IsNullOrWhiteSpace(connectionString.GetString()));
            }
        }
    }

    [TestMethod]
    public void JwtConfigurationRejectsAnOmittedSigningKey()
    {
        var configuration = BuildConfiguration(
            ("JwtSettings:Issuer", "boxd-api-testing"),
            ("JwtSettings:Audience", "boxd-web-testing"),
            ("JwtSettings:ExpirationHours", "1"));

        var exception = AssertThrows<InvalidOperationException>(() => ApiConfiguration.GetJwtSettings(configuration));

        StringAssert.Contains(exception.Message, "JwtSettings:SecretKey");
    }

    [TestMethod]
    public void JwtConfigurationRejectsAnInvalidLifetime()
    {
        var configuration = BuildConfiguration(
            ("JwtSettings:SecretKey", "a-secure-testing-key-with-32-bytes"),
            ("JwtSettings:Issuer", "boxd-api-testing"),
            ("JwtSettings:Audience", "boxd-web-testing"),
            ("JwtSettings:ExpirationHours", "0"));

        var exception = AssertThrows<InvalidOperationException>(() => ApiConfiguration.GetJwtSettings(configuration));

        StringAssert.Contains(exception.Message, "JwtSettings:ExpirationHours");
    }

    [TestMethod]
    public void JwtConfigurationAcceptsExplicitIssuerAudienceAndLifetime()
    {
        var configuration = BuildConfiguration(
            ("JwtSettings:SecretKey", "a-secure-testing-key-with-32-bytes"),
            ("JwtSettings:Issuer", "boxd-api-testing"),
            ("JwtSettings:Audience", "boxd-web-testing"),
            ("JwtSettings:ExpirationHours", "1"));

        var settings = ApiConfiguration.GetJwtSettings(configuration);

        Assert.AreEqual("boxd-api-testing", settings.Issuer);
        Assert.AreEqual("boxd-web-testing", settings.Audience);
        Assert.AreEqual(1, settings.ExpirationHours);
    }

    [TestMethod]
    public void AllowedOriginsRejectsAnEmptyConfiguration()
    {
        var configuration = BuildConfiguration();

        AssertThrows<InvalidOperationException>(() => ApiConfiguration.GetAllowedOrigins(configuration));
    }

    private static IConfiguration BuildConfiguration(params (string Key, string Value)[] values)
    {
        var settings = values.ToDictionary(value => value.Key, value => (string?)value.Value);
        return new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
    }

    private static TException AssertThrows<TException>(Action action)
        where TException : Exception
    {
        try
        {
            action();
        }
        catch (TException exception)
        {
            return exception;
        }
        catch (Exception exception)
        {
            Assert.Fail($"Expected {typeof(TException).Name} but received {exception.GetType().Name}.");
        }

        Assert.Fail($"Expected {typeof(TException).Name}.");
        throw new InvalidOperationException("Unreachable");
    }
}
