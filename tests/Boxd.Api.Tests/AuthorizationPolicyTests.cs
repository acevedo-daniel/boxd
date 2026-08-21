using Boxd.Api.Features.Auth;
using Boxd.Api.Features.Auth.Authorization;
using Boxd.Api.Features.Categories;
using Boxd.Api.Features.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Boxd.Api.Tests;

[TestClass]
public sealed class AuthorizationPolicyTests
{
    [TestMethod]
    public void NewUsersDefaultToCustomer()
    {
        Assert.AreEqual(UserRoles.Customer, new User().Role);
    }

    [TestMethod]
    public void AdministratorPolicyRequiresAnAuthenticatedAdministrator()
    {
        var options = new AuthorizationOptions();

        AuthorizationPolicies.Configure(options);

        var policy = options.GetPolicy(AuthorizationPolicies.AdministratorOnly);

        Assert.IsNotNull(policy);
        Assert.IsTrue(policy.Requirements.OfType<DenyAnonymousAuthorizationRequirement>().Any());

        var roleRequirement = policy.Requirements.OfType<RolesAuthorizationRequirement>().Single();
        CollectionAssert.Contains(roleRequirement.AllowedRoles.ToList(), UserRoles.Administrator);
        CollectionAssert.DoesNotContain(roleRequirement.AllowedRoles.ToList(), UserRoles.Customer);
    }

    [TestMethod]
    public void CatalogueMutationsRequireTheAdministratorPolicy()
    {
        AssertAdministratorOnly<ProductsController>(nameof(ProductsController.PostProduct));
        AssertAdministratorOnly<ProductsController>(nameof(ProductsController.PutProduct));
        AssertAdministratorOnly<ProductsController>(nameof(ProductsController.DeleteProduct));
        AssertAdministratorOnly<CategoriesController>(nameof(CategoriesController.PostCategory));
        AssertAdministratorOnly<CategoriesController>(nameof(CategoriesController.PutCategory));
        AssertAdministratorOnly<CategoriesController>(nameof(CategoriesController.DeleteCategory));
    }

    private static void AssertAdministratorOnly<TController>(string methodName)
    {
        var method = typeof(TController).GetMethod(methodName);
        var authorization = method?.GetCustomAttributes(typeof(AuthorizeAttribute), inherit: true)
            .Cast<AuthorizeAttribute>()
            .SingleOrDefault();

        Assert.IsNotNull(authorization, $"{typeof(TController).Name}.{methodName} must require authorization.");
        Assert.AreEqual(AuthorizationPolicies.AdministratorOnly, authorization.Policy);
    }
}
