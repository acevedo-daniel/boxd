using Boxd.Api.Features.Auth;
using Microsoft.AspNetCore.Identity;

namespace Boxd.Api.Tests;

[TestClass]
public sealed class PasswordHashingTests
{
    [TestMethod]
    public void IdentityPasswordHasherVerifiesTheCorrectPasswordAndRejectsAnIncorrectOne()
    {
        var user = new User { Username = "boxd-test-user" };
        var passwordHasher = new PasswordHasher<User>();
        var passwordHash = passwordHasher.HashPassword(user, "a-strong-test-password");

        Assert.AreEqual(
            PasswordVerificationResult.Success,
            passwordHasher.VerifyHashedPassword(user, passwordHash, "a-strong-test-password"));
        Assert.AreEqual(
            PasswordVerificationResult.Failed,
            passwordHasher.VerifyHashedPassword(user, passwordHash, "an-incorrect-password"));
    }
}
