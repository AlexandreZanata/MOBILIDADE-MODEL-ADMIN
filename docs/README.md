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
