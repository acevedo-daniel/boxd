# BOXD

> A curated e-commerce experience for desk setups, peripherals, and workspace technology, being rebuilt from an academic ASP.NET Core + React project.

BOXD is a full-stack modernization and product-redesign project. The repository currently preserves the original academic implementation as the migration baseline while the product is being redefined around a focused storefront, complete order flow, protected administration experience, and a smaller, maintainable architecture.

The end goal is deliberately dual-purpose: a polished product that can be shown to potential freelance clients and a technically credible .NET project that can be discussed in junior C#/.NET interviews.

## Status

**Phase 0 audit complete; Phase 1 repository/toolchain modernization is next.**

The repository still contains the legacy `THE BOX` implementation. The BOXD product definition and modernization constraints are documented, and the legacy baseline has been audited before implementation work begins.

Current code should not be confused with the complete BOXD version 1 scope. See [Project](docs/PROJECT.md) for the accepted product target and [Architecture](docs/ARCHITECTURE.md) for the verified baseline and modernization direction.

## Product direction

BOXD focuses on a small, curated catalogue instead of a general electronics marketplace.

Working catalogue areas:

- Keyboards
- Pointing
- Audio
- Displays
- Desk
- Accessories

The target customer journey is intentionally compact:

```text
Browse -> Product -> Cart -> Demo checkout -> Order -> Order history
```

A separate protected admin experience will manage catalogue, stock, and orders.

## Current baseline

The legacy application currently provides:

- an ASP.NET Core REST API;
- Entity Framework Core with SQL Server;
- JWT-based authentication and password recovery;
- product and category management;
- QR/Box Club functionality from the academic version;
- a React SPA built with Vite.

The current domain does **not** yet contain the complete BOXD cart/order workflow. Modernization work will decide what legacy behavior is retained, rewritten, or removed.

## Architecture

Current repository topology:

```text
apps/web/            Legacy React SPA
       |
       | HTTP / JSON
       v
apps/api/            Legacy ASP.NET Core API
       |
       | EF Core
       v
SQL Server
```

The approved modernization direction is a small monorepo with `apps/api` and `apps/web`, a .NET 10 API, a React + TypeScript frontend, feature-oriented organization, explicit authorization boundaries, automated verification, and no unnecessary distributed or enterprise architecture.

See [Architecture](docs/ARCHITECTURE.md) for the distinction between the current baseline and target constraints.

## Technology baseline

- **API:** ASP.NET Core 9, C#, Entity Framework Core 9, SQL Server, JWT authentication, Swagger/OpenAPI.
- **Web:** React 19, Vite 7, JavaScript/JSX, React Router.
- **Legacy integrations:** SMTP email and QR generation.

These are the technologies verified in the repository today. Modernized target versions and dependencies are documented separately and will only move into this section after they are implemented.

## Repository structure

| Path                   | Responsibility                                                      |
| ---------------------- | ------------------------------------------------------------------- |
| `apps/api/`            | Legacy ASP.NET Core API and persistence layer.                      |
| `apps/web/`            | Legacy React/Vite SPA.                                              |
| `docs/PROJECT.md`      | BOXD product scope, workflows, domain concepts, and business rules. |
| `docs/ARCHITECTURE.md` | Current technical baseline and approved modernization constraints.  |
| `.github/workflows/`   | Repository-level CI workflows; quality gates are refined in Phase 1.5. |
| `ROADMAP.md`           | Execution order, audit findings, and completion state.              |
| `AGENTS.md`            | Repository instructions and guardrails for coding agents.           |

The applications now occupy their target monorepo paths. Their contents remain legacy until the later API and web modernization tasks replace them intentionally.

## Local development

### API

```bash
cd apps/api
dotnet restore
dotnet ef database update --project e-commerce-api.csproj
dotnet run --project e-commerce-api.csproj
```

Before applying migrations or running the API, provide `ConnectionStrings:DefaultConnection` and `JwtSettings:SecretKey` through .NET User Secrets (development) or environment/secret configuration (deployment). Tracked `appsettings*.json` files are safe templates and intentionally do not contain credentials.

For local development, run from `apps/api/`:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<local SQL Server connection string>"
dotnet user-secrets set "JwtSettings:SecretKey" "<random signing key of at least 32 bytes>"
```

The legacy password-recovery endpoint additionally requires `SmtpSettings:Host`, `SmtpSettings:User`, `SmtpSettings:Password`, and `SmtpSettings:From` through the same secret/environment mechanism. That feature is scheduled for removal in Phase 2.

The legacy API is configured to run locally on `http://localhost:5249` by the existing project setup.

### Web

```bash
cd apps/web
npm ci
npm run dev
```

The Vite development server uses `http://localhost:5173` by default.

The current application requires local SQL Server and local secret/environment configuration. Legacy password-reset SMTP values are only needed when that legacy endpoint is deliberately exercised; the feature is scheduled for removal in Phase 2.

## Project provenance

BOXD began as **THE BOX**, an academic project developed by Acevedo Mario Daniel and Alan Quenardelle at Universidad Tecnológica Nacional (UTN).

It is now being rebuilt and maintained by Daniel Acevedo as a personal portfolio application. The modernization keeps the original project history visible while replacing academic-era product, architecture, security, and UX decisions where they no longer serve the new product.

## Documentation

- [Project](docs/PROJECT.md) — product purpose, scope, actors, workflows, domain concepts, and durable business rules.
- [Architecture](docs/ARCHITECTURE.md) — current system boundaries, known baseline concerns, modernization constraints, invariants, and trade-offs.
- [Roadmap](ROADMAP.md) — execution order, audit findings, and completion state.
