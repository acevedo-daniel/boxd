# BOXD — Roadmap

> Execution roadmap for transforming the legacy THE BOX academic project into BOXD: a polished, portfolio-ready e-commerce application that demonstrates modern .NET engineering and credible client-facing product delivery.

## Purpose

This file owns **execution order and completion state**.

It does not redefine product or architecture:

- `docs/PROJECT.md` — product scope, actors, workflows, domain semantics, and business rules.
- `docs/ARCHITECTURE.md` — current architecture, target constraints, invariants, and trade-offs.
- `AGENTS.md` — repository-level instructions for coding agents.
- `README.md` — public presentation and verified evidence.

If the roadmap conflicts with `PROJECT.md` or `ARCHITECTURE.md`, resolve the canonical document first.

## Objective

Ship **BOXD v1.0** as a small but complete commerce product that provides two kinds of evidence:

1. **Junior C#/.NET:** ASP.NET Core, EF Core, SQL, authentication/authorization, API design, persistence, migrations, testing, CI, and maintainable code.
2. **Freelance/client:** a polished storefront, complete purchase flow, responsive design, credible administration surface, live demo, and strong presentation.

Success is measured by **completion, clarity, quality, and explainability**, not feature count.

## Execution rules

Status:

```text
[ ] Not started
[~] In progress
[x] Done
[!] Blocked
[-] Removed / no longer required
```

Only one phase should normally be `[~]` at a time.

For every non-trivial task:

```text
Inspect -> Plan -> Implement -> Verify -> Review diff -> Update docs -> Integrate
```

Use short-lived branches for coherent changes. A phase may contain several branches; do not keep one branch alive for the whole roadmap. `main` should remain healthy.

A phase is complete only after:

- its verification passes;
- the diff is reviewed for accidental complexity and stale legacy behavior;
- affected documentation is synchronized;
- its exit criteria are satisfied;
- the completed phase is audited before moving on.

Do not implement future phases early. Do not add real payments, reviews, wishlists, marketplace behavior, AI recommendations, loyalty systems, multi-currency, shipping integrations, microservices, or other out-of-scope features before v1 is frozen.

---

## Phase overview

| Phase | Outcome | Status |
| --- | --- | --- |
| 0 | Verified legacy baseline and migration map | [x] |
| 1 | Clean repository and modern toolchain foundation | [~] |
| 2 | Secure, simplified API foundation | [ ] |
| 3 | Defined product UX and frontend foundation | [ ] |
| 4 | Complete public catalogue slice | [ ] |
| 5 | Complete identity/account slice | [ ] |
| 6 | Complete cart/checkout/order slice | [ ] |
| 7 | Complete administration slice | [ ] |
| 8 | Quality, security, and reliability hardening | [ ] |
| 9 | Reproducible public deployment | [ ] |
| 10 | Portfolio/repository presentation | [ ] |
| 11 | BOXD v1.0 freeze | [ ] |

---

# PHASE 0 — Audit and baseline

## Goal

Understand the legacy repository well enough to modernize it deliberately rather than rewrite it blindly.

## Tasks

### 0.1 Inventory

- [x] Inventory root docs/files, API structure, web structure, migrations, configuration, CI, and tracked artifacts.
- [x] Identify duplicate, historical, generated, local-only, and obsolete files.
- [x] Identify existing tests and whether they provide useful behavioral evidence.

### 0.2 Baseline verification

- [x] Run current API restore/build/tests.
- [x] Run web clean install/lint/build.
- [x] Start API + web locally when possible and smoke-test the important legacy flows.
- [x] Record pre-existing failures separately from future regressions.

### 0.3 Domain and security audit

- [x] Trace Product/Category behavior from HTTP to persistence.
- [x] Trace registration/login/password reset.
- [x] Trace QR/Box Club and confirm its disposition against BOXD scope.
- [x] Inspect password handling, JWT configuration, secrets, CORS, HTTPS assumptions, roles, endpoint authorization, and ownership checks.
- [x] Verify current entities/migrations and identify risky migration assumptions.

### 0.4 Architecture disposition

Classify meaningful legacy pieces as `KEEP`, `REFACTOR`, `REPLACE`, or `REMOVE`, including:

- [x] controllers/services/repositories/interfaces;
- [x] GenericRepository and AutoMapper;
- [x] DTOs and infrastructure services;
- [x] frontend routing/auth/API modules;
- [x] legacy documentation and assets.

### 0.5 Convert findings into work

- [x] Add newly discovered required work to the appropriate later phase.
- [x] Update `PROJECT.md` or `ARCHITECTURE.md` only when durable truth changes.
- [x] Avoid creating a permanent audit document unless the findings cannot be managed cleanly here.

## Exit criteria

- Current behavior and structure are understood.
- Important security/authorization defects are mapped to future work.
- Every significant legacy subsystem has a migration disposition.
- Modernization no longer depends on assumptions about the old application.

## Completed audit record — 2026-08-20

### Verified baseline and pre-existing failures

- The sole API project targets .NET 9 and restores/builds successfully with zero warnings or errors. `dotnet test` completes without executing tests because the repository has no test project.
- The legacy SPA installs and builds successfully. `npm run lint` fails with 10 existing unused-variable errors. `npm ci` reports 14 dependency vulnerabilities (2 low, 1 moderate, 11 high); this is an audit signal, not authorization for an unreviewed package upgrade.
- API and SPA development servers start, and Swagger/SPA root return HTTP 200. Catalogue requests cannot be smoke-tested against persistence in this environment: `GET /api/products` times out and `GET /api/categories` returns HTTP 500 because the required local SQL Server/database is unavailable or unhealthy. Preserve this as an environment prerequisite and establish a reproducible database path before treating it as an application regression.
- At the Phase 0 audit, the only tracked CI workflow was nested under the API and its root-level `dotnet` commands could not validate the checkout. It was moved to `.github/workflows/` in Phase 1.2; valid target-path quality gates remain Phase 1.5 work.

### Disposition and migration map

| Legacy area | Disposition | Planned treatment |
| --- | --- | --- |
| Product/category HTTP and EF Core behavior | REFACTOR | Keep it only as the catalogue migration baseline; redefine sellability, price, stock, archive, validation, and public-query behavior in Phase 4. |
| Controller/service/repository/interface chain | REPLACE | Move incrementally to feature-oriented code in Phase 2; retain only domain-specific boundaries that remain useful. |
| `GenericRepository<T>` | REMOVE | It only wraps `DbContext`/`DbSet` operations. Remove it in Phase 2. |
| AutoMapper profiles | REASSESS | Use explicit mapping or a smaller mapping boundary unless a concrete Phase 2 use remains. |
| JWT auth and custom HMAC-SHA512 password storage | REPLACE | Move to supported password hashing, validated configuration, safe errors, and explicit Customer/Admin authorization in Phase 2. |
| Password reset and SMTP service | REMOVE | Neither is in accepted v1 scope. Remove the endpoints, entities, migrations/dependency configuration, and legacy documentation during Phase 2 after configuration containment. |
| QR tokens, QRCoder, Box Club pages | REMOVE | They are outside BOXD scope; remove the API, persistence, package, SPA pages/routes, and stale documentation in Phase 2. |
| Legacy React JavaScript SPA | REPLACE | Build the new TypeScript app in Phase 1 and port only BOXD-relevant behavior. Do not fix legacy lint/style issues that disappear with the replacement. |
| Legacy API docs, SQL seed scripts, nested CI, `.vs/`, `*.csproj.user` | REMOVE or REPLACE | Preserve only useful setup/domain knowledge in canonical docs; replace manual SQL seeding with reproducible demo data and move CI to root in Phase 1/2. |

### Security and domain findings mapped to execution

- **P0 before publishing or sharing further:** tracked API configuration contains populated JWT/SMTP settings, while code also has a hard-coded JWT fallback. Treat any committed credential as potentially exposed: remove values from tracked configuration and rotate externally where applicable before the repository is made public. This is a Phase 1 containment gate.
- **P0 Phase 2:** `[Authorize]` protects product/category mutations only from anonymous users; it does not require an Administrator role. Any authenticated legacy user can mutate catalogue data. Add explicit server-side Admin policy enforcement and regression tests before re-exposing those endpoints.
- **P0 Phase 2:** authentication uses custom password cryptography; request DTOs have no declarative validation; product price/stock and category input have no trusted business validation; generic exception handlers return `ex.Message`; and there is no central production exception/problem-details policy.
- **P1 Phase 2:** QR validation is an anonymous, state-changing `GET`; reset/QR tokens are stored in plaintext; both flows are rejected legacy scope and should be deleted rather than hardened separately.
- **P1 Phase 4:** the API's public product/category reads are a usable baseline, but the SPA places all catalogue pages behind a local-storage route guard and hard-codes the API URL. Its `page` query parameter also does not match the API's `PageNumber` property. The new public catalogue must not inherit those constraints.
- **P1 Phase 4/6:** current `Product` permits nullable and unvalidated stock, hard deletion, and mutable prices. The sole initial migration contains no order model or business constraints. Define the target model and use intentional migrations; do not assume legacy data can be carried forward unchanged.

### Phase 2 decision gate

Before changing the password schema or deleting legacy tables, decide and document whether this local academic baseline needs user-data preservation. If it does not, establish a clean, reproducible demo database and retire legacy credentials/tokens. If it does, implement and test a staged credential rehash/migration plan. The audit could not verify a usable local database, so it cannot safely prescribe a data-preservation path.

---

# PHASE 1 — Repository and toolchain modernization

## Goal

Create the clean monorepo shape and supported runtime/tooling foundation without changing BOXD product behavior.

## Tasks

### 1.0 Configuration containment gate

- [x] Remove populated JWT/SMTP values from tracked configuration and replace them with safe templates plus local secret/environment configuration.
- [x] Determine externally whether any committed value must be rotated; do not record replacement secrets in the repository.
- [x] Remove hard-coded security fallbacks as part of the first API configuration change.

**Execution record — 2026-08-20:** User Secrets are enabled for local API development; shared settings and the template contain no signing key, SMTP settings, or usable database connection string; and startup validates required database/JWT/CORS configuration without fallback values. The configured GitHub remote is public and the former configuration files exist in two commits, so any credential that was valid when committed must be rotated externally before publication or deployment. No rotation, force-push, or history rewrite is authorized or performed here.

### 1.1 Repository hygiene

- [x] Remove tracked IDE/build/local artifacts such as `.vs/`.
- [x] Remove or merge obsolete legacy docs after preserving unique useful knowledge.
- [x] Update root `.gitignore` for the actual .NET/Node/IDE/environment artifacts used by BOXD.
- [-] Do not add `.editorconfig`: the legacy codebase is due for intentional replacement, so no shared formatting convention is justified yet.

**Execution record — 2026-08-20:** Removed 198 tracked IDE/build/user-setting files from the legacy API (`.vs/`, `bin/`, `obj/`, and `*.csproj.user`). Consolidated the valid local-secret setup into the root README and removed obsolete API/SPA subproject documentation and manual SQL seed notes. `.gitignore` now protects Visual Studio state, project user settings, and local application configuration files.

### 1.2 Target repository shape

Migrate toward:

```text
boxd/
├─ apps/
│  ├─ api/
│  └─ web/
├─ docs/
├─ .github/
├─ README.md
├─ ROADMAP.md
└─ AGENTS.md
```

- [x] Move the API to `apps/api/` while preserving history where practical.
- [x] Establish `apps/web/` as the target frontend location.
- [x] Move useful workflows to root `.github/workflows/`.
- [x] Remove ambiguous legacy application directories after intentional migration.

**Execution record — 2026-08-20:** Moved the legacy API and SPA source to `apps/api/` and `apps/web/`, moved the workflow to `.github/workflows/ci.yml`, and moved this roadmap to the repository root. The workflow's commands were deliberately not redesigned here; Phase 1.5 owns CI quality gates.

### 1.3 API upgrade

- [x] Upgrade .NET 9 -> .NET 10.
- [x] Upgrade ASP.NET Core / EF Core packages coherently.
- [x] Review third-party dependencies for compatibility and actual need.
- [x] Establish reproducible EF Core CLI tooling: register a compatible local `dotnet-ef` tool and remove `Microsoft.EntityFrameworkCore.Tools`; Package Manager Console support is not retained.
- [x] Resolve meaningful compiler/analyzer issues without suppressing them blindly.

**Execution record — 2026-08-21:** Upgraded `apps/api/e-commerce-api.csproj` to `net10.0` and aligned the JWT bearer and EF Core design/SQL Server packages to 10.0.11. Added root `global.json` (SDK 10.0.400 with later-patch roll-forward) for reproducible SDK selection. Registered `dotnet-ef` 10.0.11 in the root tool manifest and removed `Microsoft.EntityFrameworkCore.Tools`, because the documented workflow uses the cross-platform EF CLI rather than Visual Studio Package Manager Console. Removed the unused direct `Microsoft.AspNetCore.OpenApi` package and replaced the discontinued `AutoMapper.Extensions.Microsoft.DependencyInjection` package with the supported AutoMapper 16.2.0 core registration, eliminating its vulnerable AutoMapper 12 transitive dependency. Updated QRCoder, Swashbuckle, and `System.IdentityModel.Tokens.Jwt` after compatibility review. QR and SMTP functionality remain active legacy code and cannot safely have their supporting code/dependencies removed before their scheduled Phase 2 retirement. The API restores and builds without warnings or errors on .NET 10.

### 1.4 New web foundation

Do not mechanically convert the legacy JSX UI.

- [ ] Create React + TypeScript + Vite under `apps/web/`.
- [ ] Configure TypeScript, linting, and build verification.
- [ ] Establish routing and environment-aware API configuration.
- [ ] Port only assets/behavior that still belong to BOXD.
- [ ] Remove the legacy SPA after intentional migration.

### 1.5 Root CI

- [ ] Add API restore/build checks.
- [ ] Add web clean install/lint/typecheck/build checks.
- [ ] Ensure workflows run from repository root and real target paths.

## Documentation

- [ ] Update `ARCHITECTURE.md` so completed structure/runtime changes become current architecture.
- [ ] Update `AGENTS.md` commands and repository shape.
- [ ] Update `README.md` status/setup.
- [ ] Create `docs/DEVELOPMENT.md` only if local workflow no longer fits cleanly in README.

## Exit criteria

- Repository matches the accepted small-monorepo direction.
- API builds on .NET 10.
- New React + TypeScript frontend builds.
- Root CI checks both applications.
- No legacy parallel application remains ambiguous.

---

# PHASE 2 — API foundation, architecture, and security

## Goal

Turn the legacy API into a small, secure, testable modular application before adding the new cart/order domain.

## Tasks

### 2.1 Simplify structure

- [ ] Move toward feature-oriented organization incrementally.
- [ ] Remove `GenericRepository<T>` if it only re-wraps EF Core primitives.
- [ ] Remove service/repository interfaces that do not protect a real boundary.
- [ ] Keep domain-specific queries/services only where they add useful behavior.
- [ ] Decide whether to retain AutoMapper: evaluate the simplicity of current mappings, its licensing/deployment configuration, and migrate to explicit mapping if it adds no clear value.
- [ ] Normalize namespaces/naming around BOXD.

### 2.2 Configuration and authentication

- [ ] Establish clear development/test/production configuration boundaries.
- [ ] Preserve and regression-test the Phase 1 configuration-containment guarantees while authentication is refactored.
- [ ] Replace custom password cryptography with supported platform/library mechanisms.
- [ ] Apply the Phase 0 user-data decision: create a clean reproducible demo baseline, or implement a staged credential migration with regression tests.
- [ ] Keep issuer/audience/lifetime validation explicit.
- [ ] Remove password-reset/SMTP behavior and its persistence/configuration because it is not accepted BOXD v1 scope.

### 2.3 Authorization

- [ ] Define the smallest Customer/Admin role/policy model.
- [ ] Enforce admin authorization server-side for catalogue and future order mutations.
- [ ] Ensure customer-owned resources are authorized using authenticated identity, not client-supplied ownership.
- [ ] Add authorization regression tests.
- [ ] Require an explicit Administrator role/policy for all product/category mutations; `[Authorize]` alone is insufficient.

### 2.4 HTTP/API conventions

- [ ] Establish consistent request validation.
- [ ] Establish consistent error/problem responses.
- [ ] Centralize unexpected exception handling.
- [ ] Do not return raw exception messages in HTTP responses.
- [ ] Remove repetitive controller error handling where central handling is appropriate.
- [ ] Establish OpenAPI as the API contract source.
- [ ] Choose one .NET 10 OpenAPI generation and exploration strategy; do not retain redundant generators or specifications.

### 2.5 Persistence and test foundation

- [ ] Verify SQL Server remains appropriate for development/hosting; require an explicit decision before changing database technology.
- [ ] Clean up EF Core configuration and migration ownership.
- [ ] Replace manual seed notes with a reproducible demo-data strategy where practical.
- [ ] Create API integration-test infrastructure using the real ASP.NET Core pipeline and relational persistence behavior.
- [ ] Add initial auth/authorization/smoke integration tests and CI execution.

### 2.6 Retire rejected legacy flows

- [ ] Remove QR token API/persistence, QRCoder, Box Club UI/routes, and their stale documentation instead of carrying a separate security surface into BOXD. This includes the dependency-retirement work formerly listed under Phase 1.3.

## Documentation

- [ ] Update `ARCHITECTURE.md` with the actual post-refactor request/data flow.
- [ ] Update `AGENTS.md` verification commands.
- [ ] Create `docs/TESTING.md` only if the test workflow now needs its own source of truth.

## Exit criteria

- API structure is explainable without ceremonial layering.
- Passwords, secrets, and authorization have safe foundations.
- API errors/validation are consistent.
- Integration tests exercise the real API/persistence path.
- CI is green.

---

# PHASE 3 — Product UX and frontend foundation

## Goal

Define BOXD's interface system before feature implementation so the new frontend is cohesive rather than improvised screen by screen.

## Tasks

### 3.1 Information architecture and flows

- [ ] Define storefront navigation, catalogue/category navigation, cart/account entry points, admin navigation, and mobile behavior.
- [ ] Define the screen flows for Home, Catalogue, Product Detail, Cart, Auth, Checkout, Confirmation, Orders, Admin Overview, Admin Products, and Admin Orders.

### 3.2 Visual identity

- [ ] Define BOXD wordmark treatment and visual tone.
- [ ] Define color, typography, spacing, borders/radii, layout widths, and imagery direction.
- [ ] Define storefront and admin density separately.
- [ ] Decide light/dark usage from product needs rather than applying one style everywhere.

### 3.3 UI and application foundation

- [ ] Implement only the primitives required by designed screens: buttons, forms, product cards, statuses, admin tables/lists, feedback states, and responsive shells.
- [ ] Establish route/page composition and feature boundaries.
- [ ] Establish centralized typed API integration from OpenAPI.
- [ ] Add a server-state library only if it materially simplifies request caching/invalidation/loading behavior.
- [ ] Keep ephemeral UI state local by default.
- [ ] Keep storefront/admin as one deployable web app with distinct layouts and UX boundaries.

## Deliverable

- [ ] Create `docs/WEB-DESIGN.md` as the durable visual/UX source of truth.

## Exit criteria

- Every v1 screen has an intentional UX direction.
- Shared tokens/primitives exist without building a component library for its own sake.
- Frontend shell is responsive and supports storefront/admin separation.
- API integration is typed and centralized.

---

# PHASE 4 — Catalogue vertical slice

## Goal

Ship the first complete BOXD slice: visitors can discover and inspect the curated catalogue through the new API, database model, and interface.

## Tasks

### 4.1 Product/category model

- [ ] Reconcile legacy Product/Category fields with BOXD requirements.
- [ ] Define sellable vs archived/unavailable behavior.
- [ ] Define price representation, configured currency, and stock/availability semantics.
- [ ] Validate product/category inputs and enforce positive price/stock rules in trusted server code; do not carry forward nullable/unconstrained legacy stock behavior without an explicit model decision.
- [ ] Create intentional migrations and coherent demo catalogue data.

### 4.2 Public API

- [ ] Implement product list and product detail.
- [ ] Implement category filtering and only useful sorting/pagination.
- [ ] Handle archived/unavailable products consistently.
- [ ] Synchronize OpenAPI/typed web contract.

### 4.3 Storefront

- [ ] Implement home/storefront merchandising.
- [ ] Implement catalogue/category browsing.
- [ ] Implement product cards and product detail.
- [ ] Implement loading, empty, error, and unavailable states.
- [ ] Verify real mobile/desktop layouts and semantic accessibility basics.

### 4.4 Verification

- [ ] Integration-test important catalogue queries and availability rules.
- [ ] Verify migrations from a clean database.
- [ ] Verify storefront with seeded/demo data.

## Exit criteria

A visitor can go from storefront -> catalogue/category -> product detail using real API/database data with polished responsive states and no legacy UI in the path.

---

# PHASE 5 — Identity and account vertical slice

## Goal

Ship the customer/admin identity boundary required by commerce and administration.

## Tasks

- [ ] Finalize registration, login, logout/session behavior, and validation.
- [ ] Expose only authenticated identity information the web actually needs.
- [ ] Ensure client state cannot forge role/authorization.
- [ ] Remove obsolete legacy auth behavior not accepted for BOXD.
- [ ] Implement Login, Register, Account, authenticated navigation, and expired-session UX.
- [ ] Implement storefront/admin protected-route UX without treating route guards as security.
- [ ] Test valid/invalid auth, duplicate accounts, unauthenticated access, and Customer/Admin boundaries.

## Exit criteria

Customer and Administrator identities work through the new web/API path, with authorization enforced by the API and polished user-facing states.

---

# PHASE 6 — Cart, checkout, and orders vertical slice

## Goal

Complete the core commerce journey that turns BOXD from a catalogue into an actual e-commerce product.

## Tasks

### 6.1 Cart

- [ ] Choose the simplest cart persistence strategy consistent with `PROJECT.md`.
- [ ] Implement add/remove/update quantity behavior.
- [ ] Reconcile catalogue/stock changes before checkout.
- [ ] Keep trusted price and availability validation on the server.

### 6.2 Order domain

- [ ] Add `Order`, `OrderItem`, and status model.
- [ ] Persist product identity/name, unit-price snapshot, quantity, ownership, and other historical facts required by order history.
- [ ] Make totals reproducible from persisted order items.
- [ ] Define allowed v1 order-state transitions.
- [ ] Create and verify migrations.

### 6.3 Demo checkout

- [ ] Implement authenticated checkout.
- [ ] Revalidate product sellable state, quantity, price, and stock server-side.
- [ ] Ensure successful checkout cannot make stock negative.
- [ ] Keep order creation and stock mutation consistent as one business operation.
- [ ] Return clear conflicts when catalogue/stock changed.
- [ ] Make it explicit that no real payment was captured.

### 6.4 Customer experience

- [ ] Implement cart UI and quantity management.
- [ ] Implement checkout.
- [ ] Implement order confirmation.
- [ ] Implement customer order history/detail.
- [ ] Implement empty/error/conflict states.

### 6.5 Verification

Integration-test the high-risk rules:

- [ ] positive quantities;
- [ ] unavailable product rejection;
- [ ] insufficient stock;
- [ ] no negative stock;
- [ ] historical price snapshots;
- [ ] reproducible totals;
- [ ] customer order ownership.

Add one stable browser-level critical flow:

```text
Browse -> Product -> Cart -> Sign in -> Demo checkout -> Confirmation
```

## Exit criteria

A customer can complete BOXD's full purchase journey against persisted data, and the important commerce invariants are protected by automated tests.

---

# PHASE 7 — Administration vertical slice

## Goal

Provide a credible operational surface without mixing administration into the customer storefront.

## Tasks

### 7.1 Admin shell and authorization

- [ ] Implement separate admin layout/navigation.
- [ ] Handle non-admin access explicitly.
- [ ] Verify every mutation boundary is admin-authorized server-side.

### 7.2 Catalogue operations

- [ ] Implement admin product list/search.
- [ ] Implement product create/edit/archive/unarchive.
- [ ] Implement stock editing using accepted rules.
- [ ] Implement minimum required category management.

### 7.3 Order operations

- [ ] Implement admin order list/detail.
- [ ] Implement only allowed status transitions.
- [ ] Reject invalid transitions in trusted server logic.

### 7.4 Operational overview

- [ ] Show only a small set of metrics supported by real order data: e.g. revenue, order count, average order value, recent orders, and/or low stock.
- [ ] Keep this as application reporting, not a separate BI product.

### 7.5 Verification

- [ ] Test admin authorization on mutations.
- [ ] Test product archive/history interaction and stock changes.
- [ ] Test valid/invalid order transitions.
- [ ] Add a stable admin E2E flow such as `Admin sign in -> Create/edit product -> Verify catalogue`.

## Exit criteria

An administrator can operate catalogue and orders through a distinct, protected, coherent BOXD admin experience.

---

# PHASE 8 — Quality, security, and reliability hardening

## Goal

Stop adding scope and make the implemented product trustworthy, maintainable, responsive, and presentable.

## Tasks

### 8.1 Test audit

- [ ] Review tests by risk rather than coverage percentage.
- [ ] Ensure persistence, authorization, checkout, and order-history invariants have integration coverage.
- [ ] Keep unit tests focused on pure rules where useful.
- [ ] Keep E2E limited to critical customer/admin journeys.

### 8.2 Security and integrity audit

- [ ] Re-audit secrets, auth/password behavior, admin endpoints, customer order ownership, CORS/HTTPS, API exposure, and dependencies.
- [ ] Verify migrations from a clean database.
- [ ] Verify checkout consistency/rollback and stock conflicts.
- [ ] Verify historical orders after catalogue edits/archives.

### 8.3 Frontend quality

- [ ] Audit desktop/tablet/mobile layouts.
- [ ] Audit keyboard/focus/form accessibility basics.
- [ ] Audit loading/empty/error/unauthorized states.
- [ ] Optimize obvious image/bundle/performance issues based on measurement.
- [ ] Remove debug UI, placeholders, console noise, and dead assets.

### 8.4 Cleanup and CI

- [ ] Remove dead code, stale comments/TODOs, obsolete abstractions, and naming remnants of THE BOX where no longer needed.
- [ ] Resolve meaningful warnings.
- [ ] Verify documentation claims against implementation.
- [ ] Finalize useful CI gates for API, web, integration tests, and reliable critical E2E flows.
- [ ] Do not add decorative checks or arbitrary coverage targets.

## Documentation

- [ ] Create/update `docs/TESTING.md` only if test structure now justifies it.
- [ ] Update `ARCHITECTURE.md` and `AGENTS.md` to final verification reality.

## Exit criteria

- Important security/data invariants have meaningful automated evidence.
- No known high-severity defect remains in accepted v1 scope.
- Critical customer/admin journeys work responsively and accessibly.
- CI reliably distinguishes healthy from broken changes.
- No new feature scope remains before deployment.

---

# PHASE 9 — Deployment and demo readiness

## Goal

Produce a reproducible public BOXD deployment that can be shown without manual repair or explanation.

## Tasks

### 9.1 Hosting decision

- [ ] Choose current hosting for web, API, and relational database based on cost, reliability, environment-secret support, deployment workflow, and SQL Server constraints.
- [ ] If hosting constraints require changing database technology, make an explicit architecture decision before doing so.

### 9.2 Production configuration

- [ ] Configure database/auth/API/CORS/web URLs through environment/secrets.
- [ ] Ensure development-only settings/tools do not leak into production unintentionally.
- [ ] Establish repeatable production migrations and demo-data initialization.
- [ ] Use curated synthetic BOXD products/accounts rather than placeholder test data.

### 9.3 Deployment verification

- [ ] Deploy database, API, and web.
- [ ] Smoke-test catalogue, customer purchase journey, and admin journey.
- [ ] Verify deep-link refresh behavior and mobile layout on the hosted application.
- [ ] Verify secrets/configuration are absent from client bundles and committed files.

## Documentation

- [ ] Create `docs/DEPLOYMENT.md` if release/configuration knowledge is non-trivial.
- [ ] Add the live URL to README only after the deployment is stable.

## Exit criteria

- BOXD has a stable public URL.
- Deployment/migrations are reproducible.
- Demo data supports all portfolio flows/screenshots.
- Public customer/admin smoke tests pass.

---

# PHASE 10 — Portfolio presentation

## Goal

Turn the finished application and repository into a strong case study for recruiters and freelance clients without changing product scope.

## Tasks

### 10.1 Final README

Replace the transitional README with verified evidence:

- [ ] BOXD identity and factual one-line description.
- [ ] concise overview and live demo;
- [ ] 2–4 strong screenshots;
- [ ] key capabilities;
- [ ] 3–5 meaningful engineering highlights;
- [ ] high-level architecture and stack;
- [ ] concise local development and quality summary;
- [ ] documentation links;
- [ ] short honest provenance note.

The academic origin provides context; the finished BOXD product and modernization decisions provide the evidence.

### 10.2 Screenshots and metadata

- [ ] Capture consistent screenshots with coherent demo data, likely Storefront, Product/Catalogue, Checkout/Confirmation, and Admin.
- [ ] Store them under `docs/screenshots/` with descriptive names and useful alt text.
- [ ] Add concise GitHub description, verified homepage, and ~5–8 high-signal topics.
- [ ] Add social preview only if it materially improves presentation.
- [ ] Remove legacy presentation/docs that compete with canonical BOXD documentation.

### 10.3 Case-study readiness

Be able to explain this sequence clearly:

```text
Academic THE BOX
  -> audit
  -> BOXD product definition
  -> .NET/toolchain modernization
  -> architecture simplification
  -> security/authorization repair
  -> real cart/order domain
  -> storefront + admin redesign
  -> testing + CI
  -> deployment
```

- [ ] Prepare concrete examples of legacy problems, chosen solutions, and trade-offs.
- [ ] Be able to distinguish persisted e-commerce behavior from intentionally simulated payment.

## Exit criteria

- A recruiter can understand BOXD and its strongest engineering evidence quickly from the README.
- A potential client can see the live product/screenshots and understand the kind of product work represented.
- App, repository, docs, screenshots, and metadata tell one consistent story.

---

# PHASE 11 — BOXD v1.0 freeze

## Goal

Declare the agreed product complete and stop feature development.

## Final audit

### Product

- [ ] Visitor catalogue journey complete.
- [ ] Customer identity/account journey complete.
- [ ] Cart/checkout/order journey complete.
- [ ] Customer order history complete.
- [ ] Admin catalogue/order journey complete.
- [ ] No unapproved out-of-scope feature entered v1.

### Engineering

- [ ] .NET 10 API builds cleanly.
- [ ] React + TypeScript web builds cleanly.
- [ ] Migrations reproduce the schema.
- [ ] Important integration tests pass.
- [ ] Critical E2E flows pass.
- [ ] CI is green.
- [ ] No committed secrets or tracked IDE/build artifacts.
- [ ] No known critical authorization/data-integrity defect.

### Documentation and presentation

- [ ] `PROJECT.md` matches final v1 behavior.
- [ ] `ARCHITECTURE.md` describes completed modernization as current architecture, not future target.
- [ ] `AGENTS.md` commands/repository shape are current.
- [ ] `README.md` reflects verified final evidence.
- [ ] Optional docs exist only where justified.
- [ ] Live links and screenshots are current.

## Release

- [ ] Tag/create `v1.0.0` from the final audited state.
- [ ] Treat that release as the portfolio baseline.

After v1.0, accept only bug/security/dependency/deployment fixes and small presentation corrections unless a future version is deliberately approved.

---

# After BOXD — optional analytics case study

This is **not part of BOXD v1** and must not delay the freeze.

After BOXD has a stable commerce model and realistic synthetic sales data, a separate case study may reuse exported data with:

```text
SQL
Power BI
Power Query / DAX
Python + pandas/Jupyter when useful
```

Potential analysis: revenue over time, average order value, top/bottom products, category performance, repeat customers, sales by period, and stock-vs-sales behavior.

Present it separately as **BOXD Sales Analytics**, not as BI infrastructure inside the e-commerce application.

---

# Definition of complete

BOXD is done when the repository demonstrates this sequence end to end:

```text
Understand legacy software
  -> make deliberate product decisions
  -> modernize the platform
  -> simplify architecture
  -> protect security and data invariants
  -> build complete vertical slices
  -> verify behavior automatically
  -> deploy
  -> present the result clearly
  -> stop
```

That outcome is more valuable for this project's goals than another framework, another abstraction layer, or another unfinished feature.
