# BOXD — Architecture

> Technical source of truth for BOXD's current system boundaries and approved modernization constraints.

## Status

Phases 0 (audit and baseline) and 1 (repository/toolchain foundation) are complete. The repository still contains the legacy application; Phase 2 is the next modernization phase.

This document deliberately distinguishes between:

- **Current baseline** — architecture verified in the repository today.
- **Approved modernization direction** — constraints already accepted for the rebuild but not yet represented as implemented code.

Planned architecture must never be described as current architecture. As modernization work lands, this document should be updated in place until the distinction is no longer needed.

## Current baseline

The repository contains two application directories under `apps/`:

```text
apps/web
    -> HTTP/JSON

apps/api
    -> Entity Framework Core

SQL Server
```

The API is an ASP.NET Core application targeting .NET 10. It uses Entity Framework Core 10 with SQL Server, controller-based HTTP endpoints, JWT bearer authentication, AutoMapper, repository/service abstractions, SMTP email support, and QR generation.

The web application is a React 19 + TypeScript SPA built with Vite 7. It uses React Router, a storefront layout boundary, and a centralized environment-aware HTTP client foundation. Its current routes intentionally contain only the BOXD home and not-found states; catalogue, identity, cart, and administration remain later vertical slices.

### Current component boundaries

| Component / area | Owns | Boundary |
| --- | --- | --- |
| `apps/web/` | Browser UI, routing, storefront layout, and centralized API configuration/client code | Must not access SQL Server directly or enforce trusted authorization rules. |
| `apps/api/` | HTTP API, authentication, product/category behavior, persistence coordination, email/QR behavior | Owns server-side authorization and persistent business state. |
| SQL Server | Relational persistent data managed through EF Core migrations | Must be accessed through the API application, not from the browser. |
| SMTP integration | Password-recovery email delivery in the legacy implementation | External delivery failure must not expose credentials or internal configuration. |

### Current API structure

The legacy API is organized primarily by technical layer:

```text
Controllers
  -> Services / interfaces
      -> Repositories / interfaces
          -> ApplicationDbContext
              -> SQL Server
```

Supporting areas include DTOs, AutoMapper profiles, entity models, migrations, and infrastructure-oriented services such as email and QR generation.

The current structure is a migration baseline, not a pattern that BOXD is required to preserve. Existing abstractions must be retained only when they protect a meaningful boundary or contain useful behavior.

### Current persistent model

The verified legacy model contains:

```text
User
Product
Category
QrToken
PasswordResetToken
```

The current model does not yet contain the target BOXD cart/order domain required by `docs/PROJECT.md`.

### Current integration flow

```text
React TypeScript SPA
   -> REST/JSON
ASP.NET Core controllers
   -> services
   -> repositories
   -> EF Core DbContext
   -> SQL Server
```

Additional legacy flows include SMTP-based password recovery and QR token generation/validation.

### Current client architecture

- **Rendering:** client-side React SPA.
- **Routing:** React Router.
- **Language:** TypeScript/TSX with strict compiler configuration.
- **API access:** `src/config/environment.ts` centralizes the browser API base URL and `src/api/client.ts` provides typed request plumbing.
- **Current routes:** BOXD home and not-found states only; no legacy auth, QR, customer, or admin route was carried forward.
- **Styling:** a small responsive storefront shell stylesheet under `src/styles/`.

The web foundation has a storefront layout boundary. An administration layout will be introduced separately with its server-side authorization work in later phases.

## Known baseline issues

The modernization roadmap must address verified issues rather than preserve them by default. Important baseline concerns include:

- the API uses a controller/service/repository chain that may contain redundant abstractions;
- current authentication configuration includes development-oriented defaults that are not acceptable as final security configuration;
- authorization boundaries need to be enforced explicitly for administrator operations;
- product/category mutations currently require only an authenticated user, not an Administrator role;
- custom HMAC-SHA512 password hashing remains legacy behavior that must be replaced in Phase 2;
- JWT signing keys, local database configuration, and legacy SMTP credentials are supplied through User Secrets or environment/secret configuration; startup rejects missing JWT/database configuration rather than using fallbacks;
- request DTOs and product/category business inputs lack consistent server-side validation, and some controllers return raw exception messages;
- the API has no application test project or central production exception/problem-details policy;
- the current domain stops at catalogue/authentication behavior and is not yet a complete e-commerce order flow;
- CI runs repository-root API and web jobs against their explicit target paths; it currently covers API restore/Release build and web frozen install/typecheck/lint/build, while application tests will be added with their supporting test projects;

This list is intentionally architectural rather than a complete audit. The roadmap/audit phase may discover additional implementation defects.

## Approved modernization direction

The following decisions define the target constraints for the rebuild. They are not claims about the current code.

### Repository shape

The intended repository shape is a small monorepo with explicit deployable boundaries:

```text
boxd/
├─ apps/
│  ├─ api/
│  └─ web/
├─ docs/
│  ├─ PROJECT.md
│  ├─ ARCHITECTURE.md
│  └─ ROADMAP.md
├─ tests/              # only when separate test projects justify it
├─ .github/
│  └─ workflows/
├─ README.md
└─ AGENTS.md
```

No monorepo framework is required unless a concrete future need appears. The repository structure itself is sufficient for one API and one SPA.

### API direction

The target API is a modular ASP.NET Core application on .NET 10.

The code should be organized primarily around product capabilities/features rather than forcing every file into global technical-layer folders. A likely shape is:

```text
Features/
├─ Auth/
├─ Products/
├─ Categories/
├─ Orders/
└─ Admin/
```

This is an organizational constraint, not permission to introduce DDD, CQRS, MediatR, clean-architecture projects, repositories, or other patterns without a demonstrated need.

### Persistence direction

- Entity Framework Core remains the primary data-access technology.
- PostgreSQL is the selected relational database for the modernization. The legacy SQL Server schema remains current only until the planned Phase 2 provider migration; a minimal Docker Compose service will make PostgreSQL reproducible for local development.
- EF Core migrations own schema evolution.
- Persistence abstractions should exist only where they add a real boundary or reusable domain-specific query behavior.
- Generic repository wrappers around `DbContext`/`DbSet` operations are not a target requirement.

### Contract direction

The API is the server-side source of truth for commerce behavior.

The HTTP contract should be represented through OpenAPI and kept synchronized with the TypeScript client. When client generation or schema derivation is introduced, it should reduce contract drift rather than create an additional hand-maintained model layer.

```text
ASP.NET Core API
   -> OpenAPI contract
   -> typed web integration
React + TypeScript
```

The exact generation tooling should be selected during implementation based on simplicity and maintenance cost.

### Web direction

The target web application is React + TypeScript + Vite.

Its internal structure should separate:

- route/page composition;
- reusable UI primitives;
- feature-specific UI and behavior;
- API/server-state access;
- local ephemeral UI state.

Storefront and administration share the same web application unless a concrete reason emerges to deploy them separately, but they should have distinct navigation, layouts, and UX responsibilities.

A server-state library may be introduced when it materially simplifies request caching, invalidation, and loading/error handling. It should not become a requirement merely because it is common in React projects.

## Data and persistence invariants

- The API owns writes to persistent commerce state.
- Successful checkout cannot produce negative stock.
- Historical order items preserve the commercial facts required to display an order after catalogue data changes.
- Order totals must be reproducible from persisted order data.
- Deleting or archiving a product must not corrupt historical orders.
- Schema changes are represented by migrations rather than manual production edits.

## Security invariants

- Authentication and authorization are enforced by the API, not trusted to route guards or hidden UI.
- Administrative catalogue/order mutations require server-side administrator authorization.
- Password handling uses supported platform/library mechanisms; BOXD must not maintain custom cryptographic password schemes.
- Secrets and production credentials are supplied through environment/secret configuration and are never committed as fallback values.
- Production authentication configuration must not depend on insecure development defaults.
- Customer-owned resources are filtered/authorized by the authenticated user identity on the server.

## Client/API invariants

- The browser never talks directly to the database.
- The web app does not duplicate trusted business rules that belong to the API.
- Loading, empty, error, unauthorized, and success states are part of feature completion where relevant.
- API base URLs and environment-specific configuration are not hard-coded across feature modules.
- Changes to API request/response shapes must be reflected in the client contract in the same coherent change.

## Testing and delivery direction

Testing should protect risk and business behavior rather than chase a coverage percentage.

Expected layers as the modernization matures:

- focused unit tests for pure rules where useful;
- API integration tests for persistence, authorization, and commerce workflows;
- a small number of browser E2E tests for critical user journeys;
- CI checks at repository root for API and web build/quality gates.

These layers should be materialized only as their supporting implementation exists. Detailed commands belong in dedicated testing/development documentation only if the workflow becomes large enough to justify those files.

### Approved deployment direction

Phase 9 will deploy the React/Vite SPA to Vercel, the ASP.NET Core API as a Docker-based Render web service, and the PostgreSQL database on Neon. This is a target deployment decision, not a claim about the current runtime. Production secrets remain in provider-managed configuration: the Vercel build receives only the public API URL, and the API receives database/authentication secrets through Render. PostgreSQL migrations use Neon’s direct connection endpoint and are applied separately from API startup.

## Trade-offs

### Modular monolith over distributed services

BOXD is one portfolio-scale commerce product. A single API and relational database keep development, testing, deployment, and explanation simple while still allowing clear feature boundaries.

The cost is that scaling/deployment boundaries are shared. That is acceptable for version 1 and preferable to introducing distributed-system complexity without a product need.

### Curated catalogue over general electronics marketplace

The product deliberately limits catalogue breadth. This reduces taxonomy, filtering, merchandising, and operational complexity and allows more effort to go into the complete commerce journey and visual presentation.

### Demo checkout over real payment integration

Version 1 persists real application orders but does not charge money. This keeps payment-provider compliance, webhooks, refunds, and failure modes outside the project while preserving the core ordering domain needed for portfolio evidence.

### One web application for storefront and admin

Storefront and administration remain one deployable React application by default. Separate layouts and authorization boundaries provide product separation without duplicating deployments and frontend infrastructure.

## Related documentation

- [Project](PROJECT.md) — product scope, actors, workflows, and durable business rules.
- [Repository README](../README.md) — public project entry point and current status.
