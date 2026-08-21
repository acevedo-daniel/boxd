# Legacy API security configuration

The tracked `appsettings*.json` files intentionally contain no signing key, SMTP credentials, or usable database connection string. Do not add them back.

## Local development

The API project has a User Secrets identifier. From `e-commerce-api/`, set the required local values without committing them:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<local SQL Server connection string>"
dotnet user-secrets set "JwtSettings:SecretKey" "<random signing key of at least 32 bytes>"
```

The legacy password-recovery endpoint also needs the following values only when it is deliberately exercised:

```powershell
dotnet user-secrets set "SmtpSettings:Host" "<SMTP host>"
dotnet user-secrets set "SmtpSettings:User" "<SMTP user>"
dotnet user-secrets set "SmtpSettings:Password" "<SMTP password or app password>"
dotnet user-secrets set "SmtpSettings:From" "<sender address>"
```

`SmtpSettings:Port` and `SmtpSettings:EnableSsl` may be supplied the same way when their defaults are unsuitable.

## Environment configuration

Deployment environments must provide the same values through their secret store or environment configuration, for example `ConnectionStrings__DefaultConnection` and `JwtSettings__SecretKey`. Never put replacement values in tracked JSON files, documentation, CI variables, or command history.

The API fails at startup when its connection string, JWT key, issuer, audience, allowed origins, or token lifetime are missing or invalid. This is intentional.

## Rotation requirement

The GitHub remote is public and the former configuration files are present in repository history. Any JWT signing key or SMTP credential that was valid when committed must be rotated outside the repository before further publication or deployment. No history rewrite or credential rotation is performed by this change.

Password reset/SMTP is legacy functionality scheduled for removal in Phase 2; do not expand it while this migration baseline remains in place.
