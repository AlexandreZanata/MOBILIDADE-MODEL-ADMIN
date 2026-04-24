# Mobiliade Admin — Architecture Overview

> **Version:** 2.0.0
> **Status:** Living document — update with every accepted ADR
> **Audience:** Frontend engineers, tech leads, PR reviewers

---

## What is Mobiliade Admin

Mobiliade Admin is a role-based operations panel (RBAC) for managing rides, passengers, vehicles, and service categories. It is mission-critical, auditable, and multi-language.

---

## Tech Stack

| Category       | Technology              | Version    |
|----------------|-------------------------|------------|
| Framework      | Next.js (App Router)    | ^16.2.4    |
| UI Library     | React                   | 19.2.4     |
| Language       | TypeScript              | ^5 (strict)|
| Styling        | Tailwind CSS            | ^4         |
| Server State   | TanStack Query          | ^5.99.0    |
| Client State   | Zustand                 | ^5.0.12    |
| i18n           | i18next + react-i18next | ^26 / ^17  |
| Mocking (dev)  | MSW                     | ^2.13.3    |
| Testing        | Vitest + Testing Library| ^4 / ^16   |
| Notifications  | Sonner                  | ^2.0.7     |
| Icons          | Lucide React            | ^1.8.0     |
| Property Tests | fast-check              | 4.6.0      |

---

## Unidirectional Data Flow

```
UI Component → Custom Hook → Facade → fetch ← MSW (dev) | Real API (prod)
```

No component or hook calls `fetch` directly. All network communication goes through facades.

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # login
│   ├── (admin)/            # authenticated routes (rides, passengers, vehicles, ...)
│   ├── layout.tsx          # root layout — fonts, MSWProvider, Providers
│   ├── providers.tsx       # QueryClient + Sonner
│   └── MSWProvider.tsx     # MSW worker init
├── components/
│   ├── atoms/              # Button, Badge, Input, Avatar, RideStatusPill
│   ├── molecules/          # Modal, ConfirmDialog, ErrorState, EmptyState, NavItem, UserMenu
│   ├── organisms/          # AdminShell, SidebarNav, AuthGuard, *PageClient
│   └── auth/               # Can, PermissionsProvider
├── facades/                # One file per domain — only network boundary
├── hooks/                  # TanStack Query + Zustand hooks, organized by domain
├── stores/                 # Zustand stores (authStore)
├── models/                 # Domain types and enums (leaf module — imports nothing)
├── types/                  # Shared TypeScript types (pagination, inputs)
├── lib/                    # Utilities: apiBase, handleApiResponse, permissions, queryKeys/
├── msw/                    # MSW handlers (dev/test only)
├── i18n/                   # i18next config + locales (pt-BR, en)
├── theme/                  # CSS design tokens + TypeScript references
├── config/                 # Navigation config
└── test/                   # setup, renderWithProviders, i18n-mock, server, fixtures/
```

---

## Domains

| Domain             | Route                | Facade                      | Permission prefix        |
|--------------------|----------------------|-----------------------------|--------------------------|
| Rides              | `/rides`             | `adminRidesFacade`          | `RIDE_ADMIN_*`           |
| Passengers         | `/passengers`        | `adminPassengersFacade`     | `PASSENGER_ADMIN_*`      |
| Vehicles           | `/vehicles`          | `adminVehiclesFacade`       | `VEHICLE_ADMIN_*`        |
| Vehicle Reference  | `/vehicle-reference` | `adminVehiclesFacade`       | `VEHICLE_REFERENCE_*`    |
| Service Categories | `/service-categories`| `serviceCategoriesFacade`   | `SERVICE_CATEGORY_*`     |

---

## Module Boundaries

| Module    | Can import from                             | Forbidden                      |
|-----------|---------------------------------------------|--------------------------------|
| Atoms     | `models/`, `theme/`, `i18n/`                | hooks, facades, stores, MSW    |
| Molecules | `atoms/`, `models/`, `hooks/`               | organisms, facades, MSW        |
| Organisms | `molecules/`, `atoms/`, `hooks/`, `stores/` | facades, MSW                   |
| Hooks     | `facades/`, `stores/`, `models/`            | components, MSW                |
| Facades   | `types/`, `models/`, `lib/`                 | components, hooks, stores, MSW |
| Stores    | `models/`, `types/`                         | components, hooks, facades     |
| MSW       | `models/`, `types/`, `test/fixtures/`       | components, hooks, facades     |
| Models    | nothing                                     | everything                     |

---

## Environment Variables

| Variable                | Usage                                  |
|-------------------------|----------------------------------------|
| `NEXT_PUBLIC_API_URL`   | Backend API base URL                   |
| `NEXT_PUBLIC_MOCK_MODE` | `"true"` enables MSW in development    |

---

## NPM Scripts

```bash
npm run dev        # Next.js dev server
npm run build      # Production build
npm run lint       # ESLint (zero warnings)
npm run typecheck  # tsc --noEmit
npm run test       # Vitest --run
npm run validate   # lint + typecheck + test
```
