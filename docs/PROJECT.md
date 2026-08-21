# BOXD — Project

> Product and domain source of truth for the BOXD portfolio application.

## Product

BOXD is a curated e-commerce experience for desk setups, peripherals, and everyday workspace technology.

The product is intentionally narrower than a general electronics marketplace. It focuses on a small, coherent catalogue of products that improve how people work, create, study, and play at a desk: keyboards, pointing devices, audio, displays, desk equipment, and accessories.

BOXD is designed as a complete but deliberately small commerce product. The goal is to provide a polished customer journey and a credible administration experience without expanding into marketplace, logistics, or enterprise-commerce complexity.

The project also serves as a portfolio case study: an academic ASP.NET Core + React application is being audited, simplified, modernized, redesigned, and rebuilt into a maintainable full-stack product.

## Problem

General technology stores usually optimize for catalogue breadth. For a portfolio-scale product, reproducing that model would create large amounts of low-value catalogue, filtering, integration, and operational complexity while producing a generic shopping experience.

BOXD instead focuses on curation and presentation. A customer should be able to discover a small set of relevant products, understand them quickly, complete a purchase flow, and later review their orders. An administrator should be able to manage the catalogue and order lifecycle from a separate operational surface.

The project must demonstrate both sides of product delivery:

- a customer-facing storefront that is visually credible enough to present to freelance clients;
- a backend and data model that are technically credible enough to discuss in a junior C#/.NET interview.

## Actors

| Actor | Capabilities / responsibility |
| --- | --- |
| Visitor | Browse the storefront, catalogue, categories, and product details. |
| Customer | Authenticate, manage a cart, complete the demo checkout, and view their own orders. |
| Administrator | Manage products, categories, stock, and the order lifecycle through a protected admin experience. |

## Version 1 scope

### In scope

- Curated storefront and merchandising experience.
- Product catalogue grouped into a small set of desk/setup-oriented categories.
- Product detail pages with price, availability, imagery, and relevant product information.
- Customer registration, sign-in, sign-out, and account identity.
- Shopping cart with quantity management and calculated totals.
- Demo checkout that creates a persisted order without charging real money.
- Customer order confirmation and order history.
- Administrator product and category management.
- Administrator stock management at the level required by the catalogue.
- Administrator order list, detail, and basic status management.
- A small operational overview when useful metrics can be derived from real order data.
- Responsive customer and admin experiences.

### Catalogue direction

The initial catalogue should remain intentionally small and visually curated. The working category set is:

- Keyboards
- Pointing
- Audio
- Displays
- Desk
- Accessories

Product collections such as `Work`, `Create`, or `Play` may be used as a merchandising/navigation layer if they improve discovery. They must not create a second complex catalogue model unless the implementation has a concrete need for one.

### Out of scope

- Real payment processing in version 1.
- Marketplace or multi-vendor behavior.
- Seller accounts.
- Shipping-carrier integrations.
- Warehouse management.
- Refund and return automation.
- Coupons, promotions engine, or loyalty points.
- Product reviews and ratings.
- Wishlists.
- AI recommendations.
- Customer support chat.
- Multi-currency or multi-region commerce.
- Microservices or distributed commerce workflows.
- A separate analytics/BI product inside BOXD.

## Core workflows

### Browse and purchase

```text
Visitor
  -> Storefront
  -> Catalogue / category
  -> Product detail
  -> Add to cart
  -> Cart
  -> Sign in or register when required
  -> Demo checkout
  -> Order created
  -> Confirmation
  -> Order history
```

### Manage catalogue

```text
Administrator
  -> Admin area
  -> Products
  -> Create / edit / archive product
  -> Maintain category and stock information
  -> Storefront reflects the current sellable catalogue
```

### Manage orders

```text
Administrator
  -> Admin area
  -> Orders
  -> Inspect order
  -> Update allowed order status
  -> Customer order history reflects the current status
```

## Domain model

### User

Represents an authenticated BOXD account.

A user owns their customer orders. Administrative capability is an authorization concern attached to an account; it must not be inferred only by the client application.

### Product

Represents an item that BOXD can present and sell.

A product belongs to one catalogue category, has a price and availability/stock state, and may be removed from active sale without invalidating historical orders.

### Category

Represents the primary catalogue grouping used for product discovery and administration.

The category set should remain small and meaningful to the BOXD product identity.

### Cart

Represents the customer's current purchase intent before an order is created.

A cart contains products and positive quantities. The exact persistence mechanism is an architectural decision, but product behavior must remain consistent from add-to-cart through checkout.

### Order

Represents a completed checkout attempt accepted by BOXD.

An order belongs to one customer and contains immutable historical order lines. Product catalogue changes after purchase must not rewrite the commercial facts of an existing order.

### Order item

Represents one purchased product within an order.

At minimum it preserves the product identity/name needed for history, the purchased unit price, and quantity at the moment the order is created.

### Order status

Version 1 uses a deliberately small lifecycle:

```text
Placed -> Processing -> Completed
   \          \
    -> Cancelled <-
```

Only transitions supported by the application should be exposed to administrators.

## Business rules

- Product prices used for an existing order must not change when the catalogue price changes later.
- Order totals are derived from the order items captured at checkout.
- Product and cart quantities must be positive integers.
- Available stock must never become negative through a successful checkout.
- Checkout must fail safely when a requested product is no longer sellable or the requested quantity is unavailable.
- Catalogue administration and order administration require server-enforced administrator authorization.
- Customers may access only their own account and order information.
- Removing or archiving a product must not destroy the integrity of historical orders.
- BOXD version 1 operates with one configured currency.
- The version 1 checkout is a demo flow and must never imply that a real payment was captured.
- Product scope remains curated; catalogue breadth is not a success metric for the project.

## Product principles

- **Polish over breadth.** A smaller complete flow is more valuable than a larger incomplete store.
- **Customer and admin are distinct experiences.** Storefront presentation and operational administration should not be mixed into the same screens.
- **Business behavior over framework ceremony.** Product rules should be easy to find, test, and explain.
- **Portfolio evidence over feature count.** Every major feature should strengthen either the customer experience, the .NET engineering story, or both.
- **Freeze when complete.** After version 1 meets its agreed scope and quality bar, new features stop unless they fix a real defect or maintenance need.

## Current implementation baseline

The API currently retains legacy product/category catalogue behavior, user authentication, and QR/Box Club functionality. Password recovery and SMTP email delivery were removed because they are not accepted BOXD version 1 scope. The web application has been replaced with a React + TypeScript + Vite foundation; it intentionally contains only a minimal storefront shell until the later catalogue, identity, cart, and administration vertical slices are implemented.

It does not yet implement the complete BOXD version 1 commerce flow defined above. In particular, the current domain does not contain the target cart and order model.

This section describes migration context only. It must be updated as the legacy implementation is replaced.

## Provenance

The project began as **THE BOX**, an academic e-commerce project developed by Acevedo Mario Daniel and Alan Quenardelle at Universidad Tecnológica Nacional (UTN).

It is now being renamed, redesigned, rebuilt, and maintained by Daniel Acevedo as **BOXD**, a personal portfolio application and modernization case study. The original academic origin is preserved for context; the modernized product must not be presented as client or commercial work.

## Related documentation

- [Architecture](ARCHITECTURE.md) — current technical baseline and approved modernization constraints.
- [Repository README](../README.md) — public project entry point and current project status.
