using Microsoft.AspNetCore.Authorization;

namespace Boxd.Api.Features.Auth.Authorization;

public static class UserRoles
{
    public const string Customer = "Customer";
    public const string Administrator = "Administrator";
}

public static class AuthorizationPolicies
{
    public const string AdministratorOnly = "AdministratorOnly";

    public static void Configure(AuthorizationOptions options)
    {
        options.AddPolicy(
            AdministratorOnly,
            policy => policy.RequireAuthenticatedUser().RequireRole(UserRoles.Administrator));
    }
}
