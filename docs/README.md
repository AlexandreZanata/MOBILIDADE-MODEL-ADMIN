# GovMobile Admin — Technical Documentation

> Central index for all project documentation.

---

## Architecture

| Document                                         | Description                                                          |
|--------------------------------------------------|----------------------------------------------------------------------|
| [Overview](./architecture/overview.md)           | Stack, folder structure, architectural principles, module boundaries |
| [Domain Models](./architecture/domain-models.md) | All domain types and enums (`src/models/`)                           |

## Architecture Decision Records (ADRs)

| ADR                                                | Decision                                | Status   |
|----------------------------------------------------|-----------------------------------------|----------|
| [ADR-001](./decisions/ADR-001-facade-pattern.md)   | Facade Pattern as API abstraction layer | Accepted |
| [ADR-002](./decisions/ADR-002-atomic-design.md)    | Atomic Design as component architecture | Accepted |
| [ADR-003](./decisions/ADR-003-state-management.md) | Zustand + TanStack Query (no Redux)     | Accepted |

## Design System

| Document                                    | Description                                           |
|---------------------------------------------|-------------------------------------------------------|
| [Tokens](./design-system/tokens.md)         | Colors, radius, typography, recurring visual patterns |
| [Components](./design-system/components.md) | Full catalog: atoms, molecules, organisms, auth       |

## Implementation Guides

| Document                                                       | Description                                 |
|----------------------------------------------------------------|---------------------------------------------|
| [Feature Guide](./implementation/feature-guide.md)             | Step-by-step for implementing a new domain  |
| [Auth & Permissions](./implementation/auth-and-permissions.md) | JWT, AuthGuard, RBAC, permission system     |
| [Testing](./implementation/testing-guide.md)                   | Stack, patterns per layer, minimum coverage |
| [i18n](./implementation/i18n-guide.md)                         | Namespaces, file structure, rules           |

## Product

| Document                                  | Description                          |
|-------------------------------------------|--------------------------------------|
| [Product Overview](./product/overview.md) | Functional domains, roles, use cases |

## API Reference

| Document                                    | Description                              |
|---------------------------------------------|------------------------------------------|
| [api.json](./api.json)                      | Full OpenAPI 3.1 spec (Vamu API)         |
| [POST /v1/auth/login](./routes/auth/POST-v1-auth-login.md)     | User login — returns token pair          |
| [POST /v1/auth/logout](./routes/auth/POST-v1-auth-logout.md)   | Logout — revokes refresh token           |
| [POST /v1/auth/refresh](./routes/auth/POST-v1-auth-refresh.md) | Renew access token using refresh token   |

### Billing Admin

| Document | Description |
|----------|-------------|
| [GET /api/v1/admin/billing/config](./routes/billing-admin/GET-api-v1-admin-billing-config.md) | Get global billing configuration |
| [PUT /api/v1/admin/billing/config](./routes/billing-admin/PUT-api-v1-admin-billing-config.md) | Update global billing configuration |
| [GET /api/v1/admin/billing/jobs/history](./routes/billing-admin/GET-api-v1-admin-billing-jobs-history.md) | Job execution history |
| [POST /api/v1/admin/billing/jobs/billing-cycle/run](./routes/billing-admin/POST-api-v1-admin-billing-jobs-billing-cycle-run.md) | Run billing cycle job manually |
| [POST /api/v1/admin/billing/jobs/expiration-check/run](./routes/billing-admin/POST-api-v1-admin-billing-jobs-expiration-check-run.md) | Run expiration check job manually |
| [GET /api/v1/admin/billing/drivers/{driverId}/status](./routes/billing-admin/GET-api-v1-admin-billing-drivers-driverId-status.md) | Driver billing status |
| [GET /api/v1/admin/billing/drivers/{driverId}/cycles](./routes/billing-admin/GET-api-v1-admin-billing-drivers-driverId-cycles.md) | Driver billing cycles list |
| [POST /api/v1/admin/billing/drivers/{driverId}/unblock](./routes/billing-admin/POST-api-v1-admin-billing-drivers-driverId-unblock.md) | Manually unblock a driver |
| [GET /api/v1/admin/billing/cycles/{cycleId}](./routes/billing-admin/GET-api-v1-admin-billing-cycles-cycleId.md) | Billing cycle details |
| [POST /api/v1/admin/billing/cycles/{cycleId}/pix](./routes/billing-admin/POST-api-v1-admin-billing-cycles-cycleId-pix.md) | Generate PIX for a billing cycle |
| [POST /api/v1/admin/billing/test/create-debt](./routes/billing-admin/POST-api-v1-admin-billing-test-create-debt.md) | ⚠️ Create test debt (dev/staging only) |
| [DELETE /api/v1/admin/billing/test/debt/{cycleId}](./routes/billing-admin/DELETE-api-v1-admin-billing-test-debt-cycleId.md) | ⚠️ Delete test debt (dev/staging only) |

### Passengers

| Document | Description |
|----------|-------------|
| [POST /v1/passengers/register](./routes/passengers/POST-v1-passengers-register.md) | Register new passenger account |
| [POST /v1/passengers/verify-email](./routes/passengers/POST-v1-passengers-verify-email.md) | Verify email with code |
| [GET /v1/passengers/profile](./routes/passengers/GET-v1-passengers-profile.md) | Get authenticated passenger profile |
| [POST /v1/passengers/profile-photo](./routes/passengers/POST-v1-passengers-profile-photo.md) | Upload profile photo |
| [DELETE /v1/passengers/profile-photo](./routes/passengers/DELETE-v1-passengers-profile-photo.md) | Remove profile photo |
| [POST /v1/passengers/fare-estimate](./routes/passengers/POST-v1-passengers-fare-estimate.md) | Estimate ride fare for all categories |
| [POST /v1/passengers/rides](./routes/passengers/POST-v1-passengers-rides.md) | Request a ride |
| [GET /v1/passengers/rides](./routes/passengers/GET-v1-passengers-rides.md) | List passenger ride history |
| [GET /v1/passengers/active-ride](./routes/passengers/GET-v1-passengers-active-ride.md) | Get current active ride |
| [POST /v1/passengers/rides/{rideId}/cancel](./routes/passengers/POST-v1-passengers-rides-rideId-cancel.md) | Cancel a ride |
| [POST /v1/passengers/rides/{rideId}/ratings](./routes/passengers/POST-v1-passengers-rides-rideId-ratings.md) | Rate driver after completed ride |
| [GET /v1/passengers/ratings/me](./routes/passengers/GET-v1-passengers-ratings-me.md) | Get passenger rating |

### Drivers

| Document | Description |
|----------|-------------|
| [POST /v1/drivers/register](./routes/drivers/POST-v1-drivers-register.md) | Register new driver account |
| [POST /v1/drivers/verify-email](./routes/drivers/POST-v1-drivers-verify-email.md) | Verify email with code |
| [GET /v1/drivers/profile](./routes/drivers/GET-v1-drivers-profile.md) | Get authenticated driver profile |
| [GET /v1/drivers/validation-status](./routes/drivers/GET-v1-drivers-validation-status.md) | Get onboarding validation status |
| [POST /v1/drivers/documents](./routes/drivers/POST-v1-drivers-documents.md) | Upload CNH or CRLV document |
| [POST /v1/drivers/profile-photo](./routes/drivers/POST-v1-drivers-profile-photo.md) | Upload profile photo |
| [DELETE /v1/drivers/profile-photo](./routes/drivers/DELETE-v1-drivers-profile-photo.md) | Remove profile photo |
| [GET /v1/drivers/vehicles](./routes/drivers/GET-v1-drivers-vehicles.md) | List driver vehicles |
| [POST /v1/drivers/vehicles](./routes/drivers/POST-v1-drivers-vehicles.md) | Register a new vehicle |
| [GET /v1/drivers/vehicle-brands](./routes/drivers/GET-v1-drivers-vehicle-brands.md) | List vehicle brands |
| [GET /v1/drivers/vehicle-models](./routes/drivers/GET-v1-drivers-vehicle-models.md) | List vehicle models |
| [GET /v1/drivers/vehicle-models/brand/{brandId}](./routes/drivers/GET-v1-drivers-vehicle-models-brand-brandId.md) | List vehicle models by brand |
| [GET /v1/drivers/vehicle-requirements](./routes/drivers/GET-v1-drivers-vehicle-requirements.md) | Get vehicle year requirements per category |
| [GET /v1/drivers/service-categories](./routes/drivers/GET-v1-drivers-service-categories.md) | List service categories (driver view) |
| [GET /v1/drivers/operational-status](./routes/drivers/GET-v1-drivers-operational-status.md) | Get operational and connection status |
| [PATCH /v1/drivers/operational-status](./routes/drivers/PATCH-v1-drivers-operational-status.md) | Update operational status |
| [GET /v1/drivers/rides](./routes/drivers/GET-v1-drivers-rides.md) | List driver ride history |
| [GET /v1/drivers/active-ride](./routes/drivers/GET-v1-drivers-active-ride.md) | Get current active ride |
| [GET /v1/drivers/ratings/me](./routes/drivers/GET-v1-drivers-ratings-me.md) | Get driver rating |

### Admin - Service Categories

| Document | Description |
|----------|-------------|
| [GET /v1/admin/service-categories](./routes/service-categories/GET-v1-admin-service-categories.md) | List service categories with cursor pagination and filters |
| [POST /v1/admin/service-categories](./routes/service-categories/POST-v1-admin-service-categories.md) | Create a new service category |
| [GET /v1/admin/service-categories/{id}](./routes/service-categories/GET-v1-admin-service-categories-id.md) | Get service category by ID |
| [PATCH /v1/admin/service-categories/{id}](./routes/service-categories/PATCH-v1-admin-service-categories-id.md) | Update a service category (partial) |
| [DELETE /v1/admin/service-categories/{id}](./routes/service-categories/DELETE-v1-admin-service-categories-id.md) | Soft delete a service category |

### Webhooks

| Document | Description |
|----------|-------------|
| [GET /api/v1/webhooks/mercadopago/payment](./routes/webhooks/GET-api-v1-webhooks-mercadopago-payment.md) | Verify webhook endpoint availability |
| [POST /api/v1/webhooks/mercadopago/payment](./routes/webhooks/POST-api-v1-webhooks-mercadopago-payment.md) | Receive Mercado Pago payment notification |
| [POST /api/v1/webhooks/mercadopago/ipn](./routes/webhooks/POST-api-v1-webhooks-mercadopago-ipn.md) | Receive Mercado Pago IPN notification |

> Each endpoint lives in its own file under `docs/routes/<tag>/`. Never consolidate multiple endpoints into a single file.

---

## Quick Start

```bash
# Install dependencies
npm install

# Development with MSW active
NEXT_PUBLIC_MOCK_MODE=true npm run dev

# Full validation (lint + typecheck + tests)
npm run validate
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.govmobile.gov.br
NEXT_PUBLIC_MOCK_MODE=true   # enables MSW in development
```
