# BOXD — Agent instructions

> Repository-level operating rules for coding agents and AI-assisted development.

## Purpose

Use this file to execute changes safely and consistently. It is not a product specification and must not duplicate durable product or architecture documentation.

BOXD is in **Phase 1 of modernization**. The repository still contains the legacy academic implementation. Do not perform broad modernization, restructuring, dependency upgrades, feature work, or cleanup unless the active task explicitly asks for it.

## Read before changing code

For any non-trivial task, read the relevant source plus:

1. `docs/PROJECT.md` — accepted product scope and domain rules.
2. `docs/ARCHITECTURE.md` — current architecture, target constraints, and technical invariants.
3. `README.md` — public status and verified setup information.
4. The active roadmap/plan document once one exists.

If documentation and implementation disagree about current behavior, verify the implementation before editing documentation. Do not silently rewrite product requirements just because the legacy code behaves differently.

## Sources of truth

Use this precedence for **current implementation facts**:

1. source code and runtime configuration;
2. manifests, lockfiles, migrations/schema, and environment examples;
3. tests and CI;
4. verified runtime/deployed behavior;
5. current documentation;
6. historical notes/presentations.

Use `docs/PROJECT.md` as the source of truth for **accepted BOXD product scope and business rules**, including target behavior that the legacy implementation does not yet provide.

Use `docs/ARCHITECTURE.md` as the source of truth for the distinction between **current baseline** and **approved modernization constraints**.

## Current repository baseline

```text
boxd/
├─ e-commerce-api/      # legacy ASP.NET Core 9 API
├─ e-commerce-spa/      # legacy React/Vite JavaScript SPA
├─ docs/
├─ README.md
└─ AGENTS.md
```

Do not rename these directories to `apps/api` and `apps/web` until the active modernization task explicitly performs that migration.

## Current verification commands

Run the checks relevant to the files changed.

### API

```bash
cd e-commerce-api
dotnet restore
dotnet build
```

If tests exist for the affected area, run them. Do not claim test coverage when no relevant test suite exists.

### Web

```bash
cd e-commerce-spa
npm ci
npm run lint
npm run build
```

Do not treat a successful build as proof of runtime behavior when the change depends on API/database interaction.

## Change discipline

- Inspect before editing.
- Keep each change coherent and scoped to the active task.
- Prefer the smallest implementation that satisfies the accepted requirement.
- Do not refactor unrelated files opportunistically.
- Do not add dependencies without a concrete need and a clear benefit over platform/existing capabilities.
- Do not create duplicate `-new`, `-v2`, `backup`, or parallel documentation/code paths when an existing canonical file should be updated.
- Do not preserve legacy abstractions merely because they already exist.
- Do not remove unique project knowledge without moving any still-valid facts to the correct source of truth.
- Do not implement future roadmap phases early.
- Do not expand scope with reviews, real payments, marketplace behavior, loyalty systems, chat, AI recommendations, microservices, or other out-of-scope features unless product scope is explicitly changed first.

## Architecture guardrails

The modernization target is a small modular monolith:

```text
React + TypeScript web
        -> HTTP/OpenAPI
ASP.NET Core API
        -> EF Core
SQL Server
```

Guardrails:

- The API owns persistent commerce state and trusted business rules.
- The browser never accesses the database directly.
- Server-side authorization protects all administrative and customer-owned resources.
- Prefer feature-oriented organization as the legacy API is refactored.
- Do not introduce Clean Architecture projects, CQRS, MediatR, event buses, microservices, generic repositories, Unit of Work wrappers, caching infrastructure, or other patterns without a demonstrated project requirement.
- EF Core `DbContext`/`DbSet` capabilities should not be re-wrapped automatically.
- Keep storefront and admin as one web deployable by default, with separate UX/layout boundaries.
- Keep API/web contracts synchronized; use OpenAPI as the contract source when that workflow is implemented.

## Product guardrails

The BOXD version 1 product is a curated desk/setup technology store.

Primary catalogue direction:

- Keyboards
- Pointing
- Audio
- Displays
- Desk
- Accessories

Required product journey:

```text
Browse -> Product -> Cart -> Demo checkout -> Persisted order -> Order history
```

Required administration journey:

```text
Admin -> Products / Categories / Stock / Orders
```

When a requested implementation conflicts with `docs/PROJECT.md`, stop expanding the implementation and surface the conflict in the task result. Product scope should be changed deliberately before code follows it.

## Domain invariants

Do not introduce code that violates these rules:

- order history is not rewritten by later catalogue price/name changes when those facts are required historically;
- order totals are based on persisted order-item facts;
- successful checkout cannot make stock negative;
- quantities are positive integers;
- archived/removed products do not invalidate existing orders;
- customers cannot access another customer's orders;
- admin-only operations are enforced by the API;
- demo checkout must not be represented as a real captured payment.

## Security guardrails

- Never commit secrets, tokens, SMTP passwords, production connection strings, or JWT signing keys.
- Never add hard-coded secret fallbacks.
- Do not create or preserve custom password cryptography when supported platform/library mechanisms can be used.
- Do not weaken HTTPS/authentication validation to make production setup easier.
- Do not trust a frontend route guard as authorization.
- Do not expose internal exception details or credential/configuration values in API responses.
- Treat security-sensitive legacy code as migration input, not as automatically approved behavior.

## Frontend guardrails

As the new web application is introduced:

- use TypeScript for new target code;
- keep route/page composition separate from reusable UI and feature logic;
- centralize environment-aware API configuration;
- avoid duplicating server business rules in the browser;
- implement meaningful loading, empty, error, unauthorized, and success states;
- keep storefront and admin visually/structurally distinct;
- prioritize responsive behavior and accessible semantic HTML;
- do not add a state-management library when local state/server-state tools are sufficient.

Do not convert legacy JSX mechanically just to preserve code. Reuse behavior only when it still fits the BOXD product and target architecture.

## Backend guardrails

As the API is modernized:

- target .NET 10 only when the active modernization task performs the upgrade;
- preserve working behavior during structural migrations unless the task deliberately changes it;
- favor clear feature boundaries and direct EF Core usage over ceremonial layers;
- validate request data and return consistent error responses;
- keep authorization decisions close to trusted server behavior;
- use migrations for schema evolution;
- keep order creation/stock changes consistent as one business operation;
- add abstractions only after identifying the concrete boundary they protect.

## Tests and verification

Tests are evidence, not decoration.

When implementing a behavior:

- add or update tests for important business rules and regressions;
- prefer API integration tests for persistence and authorization behavior;
- use focused unit tests for pure rules where they add signal;
- add only a small number of E2E flows for critical customer/admin journeys;
- do not chase 100% coverage;
- do not delete or weaken a failing test merely to make CI pass without understanding the failure.

Before declaring a task complete, report the exact checks run and their result. If a required check cannot run, state why.

## Documentation rules

Follow the repository documentation standard:

- `README.md` = public entry point and verified evidence.
- `docs/PROJECT.md` = product scope, actors, workflows, domain semantics, business rules.
- `docs/ARCHITECTURE.md` = system boundaries, data/integration flow, invariants, trade-offs.
- roadmap/plan documents = execution state, not durable product truth.

Do not describe planned technology/features as already implemented.

Update documentation in the same coherent change when implementation makes it stale. Do not create extra documentation unless the information has a distinct durable responsibility.

## Git and review hygiene

- Keep changes reviewable and scoped.
- Do not rewrite repository history to hide tooling or AI assistance.
- Do not commit generated build output, IDE state, local databases, or secrets.
- Before finalizing a large change, inspect the diff for accidental files, stale comments, debug code, temporary notes, and unrelated formatting churn.
- Do not create commits, branches, pushes, or pull requests unless the active task explicitly authorizes those Git operations.

## Task completion format

For implementation tasks, finish with a concise report:

```text
Changed
- ...

Verified
- command/check: result

Documentation
- updated/not required

Remaining
- only genuine follow-up work or blockers
```

Do not claim the broader phase is complete unless its documented exit criteria have actually been met.
