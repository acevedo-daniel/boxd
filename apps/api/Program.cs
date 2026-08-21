using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Boxd.Api.Data;
using Boxd.Api.Features.Auth;
using Boxd.Api.Features.Categories;
using Boxd.Api.Features.Products;
using Boxd.Api.Features.Qr;
using Boxd.Api.Infrastructure.Email;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = RequireConfigurationValue(builder.Configuration, "ConnectionStrings:DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var jwtSecret = RequireConfigurationValue(builder.Configuration, "JwtSettings:SecretKey");
var jwtIssuer = RequireConfigurationValue(builder.Configuration, "JwtSettings:Issuer");
var jwtAudience = RequireConfigurationValue(builder.Configuration, "JwtSettings:Audience");

if (Encoding.UTF8.GetByteCount(jwtSecret) < 32)
{
    throw new InvalidOperationException("Configuration key 'JwtSettings:SecretKey' must be at least 32 bytes.");
}

if (jwtSettings.GetValue<int?>("ExpirationHours") is not > 0)
{
    throw new InvalidOperationException("Configuration key 'JwtSettings:ExpirationHours' must be a positive integer.");
}

var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
if (allowedOrigins is not { Length: > 0 } || allowedOrigins.Any(string.IsNullOrWhiteSpace))
{
    throw new InvalidOperationException("Configuration key 'AllowedOrigins' must contain at least one origin.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("SpaCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<QrService>();
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("SpaCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static string RequireConfigurationValue(IConfiguration configuration, string key)
{
    var value = configuration[key];
    if (string.IsNullOrWhiteSpace(value))
    {
        throw new InvalidOperationException($"Configuration key '{key}' is required. Supply it through User Secrets or environment configuration.");
    }

    return value;
}
