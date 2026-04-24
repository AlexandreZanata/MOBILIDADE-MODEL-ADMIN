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

| Document                                                       | Description                            |
|----------------------------------------------------------------|----------------------------------------|
| [api.json](./api.json)                                         | Full OpenAPI 3.1 spec (Vamu API)       |
| [POST /v1/auth/login](./routes/auth/POST-v1-auth-login.md)     | User login — returns token pair        |
| [POST /v1/auth/logout](./routes/auth/POST-v1-auth-logout.md)   | Logout — revokes refresh token         |
| [POST /v1/auth/refresh](./routes/auth/POST-v1-auth-refresh.md) | Renew access token using refresh token |

### Billing Admin

| Document                                                                                                                              | Description                            |
|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| [GET /api/v1/admin/billing/config](./routes/billing-admin/GET-api-v1-admin-billing-config.md)                                         | Get global billing configuration       |
| [PUT /api/v1/admin/billing/config](./routes/billing-admin/PUT-api-v1-admin-billing-config.md)                                         | Update global billing configuration    |
| [GET /api/v1/admin/billing/jobs/history](./routes/billing-admin/GET-api-v1-admin-billing-jobs-history.md)                             | Job execution history                  |
| [POST /api/v1/admin/billing/jobs/billing-cycle/run](./routes/billing-admin/POST-api-v1-admin-billing-jobs-billing-cycle-run.md)       | Run billing cycle job manually         |
| [POST /api/v1/admin/billing/jobs/expiration-check/run](./routes/billing-admin/POST-api-v1-admin-billing-jobs-expiration-check-run.md) | Run expiration check job manually      |
| [GET /api/v1/admin/billing/drivers/{driverId}/status](./routes/billing-admin/GET-api-v1-admin-billing-drivers-driverId-status.md)     | Driver billing status                  |
| [GET /api/v1/admin/billing/drivers/{driverId}/cycles](./routes/billing-admin/GET-api-v1-admin-billing-drivers-driverId-cycles.md)     | Driver billing cycles list             |
| [POST /api/v1/admin/billing/drivers/{driverId}/unblock](./routes/billing-admin/POST-api-v1-admin-billing-drivers-driverId-unblock.md) | Manually unblock a driver              |
| [GET /api/v1/admin/billing/cycles/{cycleId}](./routes/billing-admin/GET-api-v1-admin-billing-cycles-cycleId.md)                       | Billing cycle details                  |
| [POST /api/v1/admin/billing/cycles/{cycleId}/pix](./routes/billing-admin/POST-api-v1-admin-billing-cycles-cycleId-pix.md)             | Generate PIX for a billing cycle       |
| [POST /api/v1/admin/billing/test/create-debt](./routes/billing-admin/POST-api-v1-admin-billing-test-create-debt.md)                   | ⚠️ Create test debt (dev/staging only) |
| [DELETE /api/v1/admin/billing/test/debt/{cycleId}](./routes/billing-admin/DELETE-api-v1-admin-billing-test-debt-cycleId.md)           | ⚠️ Delete test debt (dev/staging only) |

### Passengers

| Document                                                                                                     | Description                           |
|--------------------------------------------------------------------------------------------------------------|---------------------------------------|
| [POST /v1/passengers/register](./routes/passengers/POST-v1-passengers-register.md)                           | Register new passenger account        |
| [POST /v1/passengers/verify-email](./routes/passengers/POST-v1-passengers-verify-email.md)                   | Verify email with code                |
| [GET /v1/passengers/profile](./routes/passengers/GET-v1-passengers-profile.md)                               | Get authenticated passenger profile   |
| [POST /v1/passengers/profile-photo](./routes/passengers/POST-v1-passengers-profile-photo.md)                 | Upload profile photo                  |
| [DELETE /v1/passengers/profile-photo](./routes/passengers/DELETE-v1-passengers-profile-photo.md)             | Remove profile photo                  |
| [POST /v1/passengers/fare-estimate](./routes/passengers/POST-v1-passengers-fare-estimate.md)                 | Estimate ride fare for all categories |
| [POST /v1/passengers/rides](./routes/passengers/POST-v1-passengers-rides.md)                                 | Request a ride                        |
| [GET /v1/passengers/rides](./routes/passengers/GET-v1-passengers-rides.md)                                   | List passenger ride history           |
| [GET /v1/passengers/active-ride](./routes/passengers/GET-v1-passengers-active-ride.md)                       | Get current active ride               |
| [POST /v1/passengers/rides/{rideId}/cancel](./routes/passengers/POST-v1-passengers-rides-rideId-cancel.md)   | Cancel a ride                         |
| [POST /v1/passengers/rides/{rideId}/ratings](./routes/passengers/POST-v1-passengers-rides-rideId-ratings.md) | Rate driver after completed ride      |
| [GET /v1/passengers/ratings/me](./routes/passengers/GET-v1-passengers-ratings-me.md)                         | Get passenger rating                  |

### Drivers

| Document                                                                                                          | Description                                |
|-------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| [POST /v1/drivers/register](./routes/drivers/POST-v1-drivers-register.md)                                         | Register new driver account                |
| [POST /v1/drivers/verify-email](./routes/drivers/POST-v1-drivers-verify-email.md)                                 | Verify email with code                     |
| [GET /v1/drivers/profile](./routes/drivers/GET-v1-drivers-profile.md)                                             | Get authenticated driver profile           |
| [GET /v1/drivers/validation-status](./routes/drivers/GET-v1-drivers-validation-status.md)                         | Get onboarding validation status           |
| [POST /v1/drivers/documents](./routes/drivers/POST-v1-drivers-documents.md)                                       | Upload CNH or CRLV document                |
| [POST /v1/drivers/profile-photo](./routes/drivers/POST-v1-drivers-profile-photo.md)                               | Upload profile photo                       |
| [DELETE /v1/drivers/profile-photo](./routes/drivers/DELETE-v1-drivers-profile-photo.md)                           | Remove profile photo                       |
| [GET /v1/drivers/vehicles](./routes/drivers/GET-v1-drivers-vehicles.md)                                           | List driver vehicles                       |
| [POST /v1/drivers/vehicles](./routes/drivers/POST-v1-drivers-vehicles.md)                                         | Register a new vehicle                     |
| [GET /v1/drivers/vehicle-brands](./routes/drivers/GET-v1-drivers-vehicle-brands.md)                               | List vehicle brands                        |
| [GET /v1/drivers/vehicle-models](./routes/drivers/GET-v1-drivers-vehicle-models.md)                               | List vehicle models                        |
| [GET /v1/drivers/vehicle-models/brand/{brandId}](./routes/drivers/GET-v1-drivers-vehicle-models-brand-brandId.md) | List vehicle models by brand               |
| [GET /v1/drivers/vehicle-requirements](./routes/drivers/GET-v1-drivers-vehicle-requirements.md)                   | Get vehicle year requirements per category |
| [GET /v1/drivers/service-categories](./routes/drivers/GET-v1-drivers-service-categories.md)                       | List service categories (driver view)      |
| [GET /v1/drivers/operational-status](./routes/drivers/GET-v1-drivers-operational-status.md)                       | Get operational and connection status      |
| [PATCH /v1/drivers/operational-status](./routes/drivers/PATCH-v1-drivers-operational-status.md)                   | Update operational status                  |
| [GET /v1/drivers/rides](./routes/drivers/GET-v1-drivers-rides.md)                                                 | List driver ride history                   |
| [GET /v1/drivers/active-ride](./routes/drivers/GET-v1-drivers-active-ride.md)                                     | Get current active ride                    |
| [GET /v1/drivers/ratings/me](./routes/drivers/GET-v1-drivers-ratings-me.md)                                       | Get driver rating                          |

### Admin - Vehicles

| Document | Description |
|----------|-------------|
| [GET /v1/admin/vehicles](./routes/admin-vehicles/GET-v1-admin-vehicles.md) | List all vehicles with cursor pagination |
| [GET /v1/admin/vehicle-category-requirements](./routes/admin-vehicles/GET-v1-admin-vehicle-category-requirements.md) | List all vehicle category requirements |
| [POST /v1/admin/vehicle-category-requirements](./routes/admin-vehicles/POST-v1-admin-vehicle-category-requirements.md) | Create or update vehicle category requirement |
| [GET /v1/admin/vehicle-category-requirements/category/{categoryId}](./routes/admin-vehicles/GET-v1-admin-vehicle-category-requirements-category-categoryId.md) | Get requirement by category |
| [DELETE /v1/admin/vehicle-category-requirements/category/{categoryId}](./routes/admin-vehicles/DELETE-v1-admin-vehicle-category-requirements-category-categoryId.md) | Remove category requirement |

### Driver - Rides

| Document                                                                                                                     | Description                            |
|------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| [GET /v1/drivers/rides/{rideId}](./routes/driver-rides/GET-v1-drivers-rides-rideId.md)                                       | Get ride details                       |
| [PATCH /v1/drivers/rides/{rideId}/on-the-way](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-on-the-way.md)             | Mark driver on the way to pickup       |
| [PATCH /v1/drivers/rides/{rideId}/nearby](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-nearby.md)                     | Mark driver nearby (≤500m from pickup) |
| [PATCH /v1/drivers/rides/{rideId}/arrived](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-arrived.md)                   | Mark driver arrived at pickup (≤100m)  |
| [PATCH /v1/drivers/rides/{rideId}/boarded](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-boarded.md)                   | Mark passenger boarded                 |
| [PATCH /v1/drivers/rides/{rideId}/in-route](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-in-route.md)                 | Mark en route to destination           |
| [PATCH /v1/drivers/rides/{rideId}/near-destination](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-near-destination.md) | Mark near destination (≤500m)          |
| [PATCH /v1/drivers/rides/{rideId}/complete](./routes/driver-rides/PATCH-v1-drivers-rides-rideId-complete.md)                 | Complete ride                          |
| [POST /v1/drivers/rides/{rideId}/cancel](./routes/driver-rides/POST-v1-drivers-rides-rideId-cancel.md)                       | Cancel ride (with penalty details)     |
| [POST /v1/drivers/rides/{rideId}/ratings](./routes/driver-rides/POST-v1-drivers-rides-rideId-ratings.md)                     | Rate passenger after completed ride    |

### Places & Geocoding

| Document                                                                             | Description                                     |
|--------------------------------------------------------------------------------------|-------------------------------------------------|
| [GET /v1/places/reverse-geocode](./routes/places/GET-v1-places-reverse-geocode.md)   | Reverse geocoding — GET version (testing only)  |
| [POST /v1/places/reverse-geocode](./routes/places/POST-v1-places-reverse-geocode.md) | Reverse geocoding — coordinates → address       |
| [GET /v1/places/geocode](./routes/places/GET-v1-places-geocode.md)                   | Geocoding — GET version (testing only)          |
| [POST /v1/places/geocode](./routes/places/POST-v1-places-geocode.md)                 | Geocoding — address → coordinates               |
| [POST /v1/places/details](./routes/places/POST-v1-places-details.md)                 | Place details by place_id                       |
| [GET /v1/places/details/{placeId}](./routes/places/GET-v1-places-details-placeId.md) | Place details — GET version (testing only)      |
| [GET /v1/places/autocomplete](./routes/places/GET-v1-places-autocomplete.md)         | Place autocomplete — GET version (testing only) |
| [POST /v1/places/autocomplete](./routes/places/POST-v1-places-autocomplete.md)       | Place autocomplete with rate limiting           |
| [GET /v1/places/rate-limit](./routes/places/GET-v1-places-rate-limit.md)             | Current rate limit info per API type            |
| [GET /v1/places/quota](./routes/places/GET-v1-places-quota.md)                       | Daily quota and cost statistics                 |

### Driver Billing

| Document                                                                                                                     | Description                         |
|------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| [GET /api/v1/driver/billing/status](./routes/driver-billing/GET-api-v1-driver-billing-status.md)                             | Get complete billing status         |
| [GET /api/v1/driver/billing/blocked](./routes/driver-billing/GET-api-v1-driver-billing-blocked.md)                           | Check if driver is blocked          |
| [GET /api/v1/driver/billing/cycles](./routes/driver-billing/GET-api-v1-driver-billing-cycles.md)                             | List all billing cycles             |
| [GET /api/v1/driver/billing/cycles/{cycleId}](./routes/driver-billing/GET-api-v1-driver-billing-cycles-cycleId.md)           | Get billing cycle details           |
| [POST /api/v1/driver/billing/debt/pix](./routes/driver-billing/POST-api-v1-driver-billing-debt-pix.md)                       | Generate PIX to settle pending debt |
| [POST /api/v1/driver/billing/cycles/{cycleId}/pix](./routes/driver-billing/POST-api-v1-driver-billing-cycles-cycleId-pix.md) | Generate PIX for a specific cycle   |

### Card Brands

| Document                                                                  | Description                  |
|---------------------------------------------------------------------------|------------------------------|
| [GET /v1/card-brands](./routes/card-brands/GET-v1-card-brands.md)         | List all enabled card brands |
| [GET /v1/card-brands/{id}](./routes/card-brands/GET-v1-card-brands-id.md) | Get card brand by ID         |

### Admin - Vehicle Reference

| Document                                                                                                                                    | Description                       |
|---------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| [GET /v1/admin/vehicle-reference/brands](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-brands.md)                               | List vehicle brands               |
| [POST /v1/admin/vehicle-reference/brands](./routes/vehicle-reference/POST-v1-admin-vehicle-reference-brands.md)                             | Create vehicle brand              |
| [GET /v1/admin/vehicle-reference/brands/{id}](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-brands-id.md)                       | Get brand by ID                   |
| [PATCH /v1/admin/vehicle-reference/brands/{id}](./routes/vehicle-reference/PATCH-v1-admin-vehicle-reference-brands-id.md)                   | Update brand                      |
| [DELETE /v1/admin/vehicle-reference/brands/{id}](./routes/vehicle-reference/DELETE-v1-admin-vehicle-reference-brands-id.md)                 | Delete brand                      |
| [GET /v1/admin/vehicle-reference/models](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-models.md)                               | List vehicle models               |
| [POST /v1/admin/vehicle-reference/models](./routes/vehicle-reference/POST-v1-admin-vehicle-reference-models.md)                             | Create vehicle model              |
| [GET /v1/admin/vehicle-reference/models/{id}](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-models-id.md)                       | Get model by ID                   |
| [PATCH /v1/admin/vehicle-reference/models/{id}](./routes/vehicle-reference/PATCH-v1-admin-vehicle-reference-models-id.md)                   | Update model                      |
| [DELETE /v1/admin/vehicle-reference/models/{id}](./routes/vehicle-reference/DELETE-v1-admin-vehicle-reference-models-id.md)                 | Delete model                      |
| [GET /v1/admin/vehicle-reference/models/brand/{brandId}](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-models-brand-brandId.md) | List models by brand              |
| [GET /v1/admin/vehicle-reference/min-year](./routes/vehicle-reference/GET-v1-admin-vehicle-reference-min-year.md)                           | Get minimum year configuration    |
| [PATCH /v1/admin/vehicle-reference/min-year](./routes/vehicle-reference/PATCH-v1-admin-vehicle-reference-min-year.md)                       | Update minimum year configuration |

### Admin - Service Categories

| Document                                                                                                         | Description                                                |
|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| [GET /v1/admin/service-categories](./routes/service-categories/GET-v1-admin-service-categories.md)               | List service categories with cursor pagination and filters |
| [POST /v1/admin/service-categories](./routes/service-categories/POST-v1-admin-service-categories.md)             | Create a new service category                              |
| [GET /v1/admin/service-categories/{id}](./routes/service-categories/GET-v1-admin-service-categories-id.md)       | Get service category by ID                                 |
| [PATCH /v1/admin/service-categories/{id}](./routes/service-categories/PATCH-v1-admin-service-categories-id.md)   | Update a service category (partial)                        |
| [DELETE /v1/admin/service-categories/{id}](./routes/service-categories/DELETE-v1-admin-service-categories-id.md) | Soft delete a service category                             |

### Webhooks

| Document                                                                                                   | Description                               |
|------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| [GET /api/v1/webhooks/mercadopago/payment](./routes/webhooks/GET-api-v1-webhooks-mercadopago-payment.md)   | Verify webhook endpoint availability      |
| [POST /api/v1/webhooks/mercadopago/payment](./routes/webhooks/POST-api-v1-webhooks-mercadopago-payment.md) | Receive Mercado Pago payment notification |
| [POST /api/v1/webhooks/mercadopago/ipn](./routes/webhooks/POST-api-v1-webhooks-mercadopago-ipn.md)         | Receive Mercado Pago IPN notification     |

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
