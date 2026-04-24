# Mobiliade Admin — Architecture Overview

> **Version:** 2.0.0
> **Status:** Living document — update with every accepted ADR
> **Audience:** Frontend engineers, tech leads, PR reviewers

---

## What is Mobiliade Admin

Mobiliade Admin is a role-based operations panel (RBAC) for managing rides, passengers,
vehicles, service categories, and billing. It is mission-critical, auditable, and multi-language.

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
│   ├── (admin)/            # authenticated routes
│   │   ├── rides/
│   │   ├── passengers/
│   │   ├── vehicles/
│   │   ├── vehicle-reference/
│   │   └── service-categories/
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
├── theme/                  # CSS design tokens (govmobile.css) + TS token references (tokens.ts)
├── config/                 # Navigation config
└── test/                   # setup, renderWithProviders, i18n-mock, server, fixtures/
```

---

## API Domains & Routes

| Domain             | Route                  | Facade                      | Permission prefix         |
|--------------------|------------------------|-----------------------------|---------------------------|
| Auth               | `/login`               | `authFacade`                | —                         |
| Rides              | `/rides`               | `adminRidesFacade`          | `RIDE_ADMIN_*`            |
| Passengers         | `/passengers`          | `adminPassengersFacade`     | `PASSENGER_ADMIN_*`       |
| Vehicles           | `/vehicles`            | `adminVehiclesFacade`       | `VEHICLE_ADMIN_*`         |
| Vehicle Reference  | `/vehicle-reference`   | `adminVehiclesFacade`       | `VEHICLE_REFERENCE_*`     |
| Service Categories | `/service-categories`  | `serviceCategoriesFacade`   | `SERVICE_CATEGORY_*`      |

### API Endpoints per Domain

**Auth** (`/v1/auth/`)
- `POST /v1/auth/login` — authenticate user, returns JWT pair
- `POST /v1/auth/logout` — invalidate session
- `POST /v1/auth/refresh` — rotate access token (mutex-protected)

**Admin Rides** (`/v1/admin/rides`)
- `GET /v1/admin/rides` — paginated list with filters (status, q, cursor, limit)
- `PATCH /v1/admin/rides/:rideId/status` — update ride status
- `POST /v1/admin/rides/:rideId/cancel` — cancel ride with optional reason

**Admin Passengers** (`/v1/admin/passengers`)
- `GET /v1/admin/passengers` — paginated list with filters (q, birthDate range)
- `DELETE /v1/admin/passengers/:passengerId` — soft-delete passenger
- `POST /v1/admin/passengers/:passengerId/reactivate` — restore passenger

**Admin Vehicles** (`/v1/admin/vehicles`)
- `GET /v1/admin/vehicles` — paginated list with filters (status, q)

**Vehicle Reference** (`/v1/admin/vehicle-reference`)
- `GET /v1/admin/vehicle-reference/brands` — paginated brand list
- `POST /v1/admin/vehicle-reference/brands` — create brand
- `PATCH /v1/admin/vehicle-reference/brands/:id` — update brand
- `DELETE /v1/admin/vehicle-reference/brands/:id` — delete brand
- `GET /v1/admin/vehicle-reference/models` — paginated model list

**Service Categories** (`/v1/admin/service-categories`)
- `GET /v1/admin/service-categories` — paginated list
- `POST /v1/admin/service-categories` — create category
- `PATCH /v1/admin/service-categories/:id` — update category

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

## State Management

| Type                   | Tool                 | Examples                                      |
|------------------------|----------------------|-----------------------------------------------|
| Remote data            | TanStack Query       | Lists, details                                |
| Mutations              | TanStack Query       | Create, edit, delete                          |
| Active filters         | Zustand              | Table filters                                 |
| Modal state            | Zustand              | Dialog open/close                             |
| Session / role         | Zustand (`authStore`)| Authenticated user, isAuthenticated           |
| Form state             | React local state    | Controlled fields                             |
| URL state              | Next.js searchParams | Pagination, shareable filters                 |

### TanStack Query — Global Config

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,   // 5 minutes
      gcTime: 10 * 60_000,     // 10 minutes
      retry: 1,
    },
  },
})
```

### Query Key Factory Pattern

```typescript
export const adminRidesKeys = {
  all: ["adminRides"] as const,
  list: (params?: AdminRidesListParams) =>
    [...adminRidesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...adminRidesKeys.all, "detail", id] as const,
};
```

---

## Authentication & Session

- Access token stored in module-level memory (never persisted)
- Refresh token stored in `sessionStorage` (survives page refresh, cleared on tab close)
- `authFacade.fetchWithAuth()` auto-refreshes on 401 with mutex to prevent duplicate calls
- `AuthGuard` organism protects all admin routes
- `PermissionsProvider` injects the user's role into the permissions context

---

## Permission System

```typescript
// Via hook
const { can } = usePermissions();
if (can(Permission.RIDE_ADMIN_CANCEL)) { ... }

// Via component
<Can perform={Permission.RIDE_ADMIN_CANCEL}>
  <Button>Cancel Ride</Button>
</Can>
```

Permissions are defined in `src/models/Permission.ts`.
Role-to-permission mapping is in `src/lib/permissions.ts`.
Hardcoded role checks (`user.role === "ADMIN"`) are forbidden in components.

---

## Internationalization (i18n)

- Supported languages: `pt-BR` (default) and `en`
- Preference saved in `localStorage` (`mobiliade.language`)
- Automatic fallback to `pt-BR`
- Namespaces: `common`, `auth`, `nav`, `rides`, `passengers`, `vehicles`, `serviceCategories`

---

## Design System

- `src/theme/govmobile.css` — Tailwind `@theme` with CSS custom properties
- `src/theme/tokens.ts` — TypeScript references to CSS variables
- `src/app/globals.css` — Tailwind import + body defaults
- Fonts: Geist Sans + Geist Mono via `next/font/google`

---

## API Proxy

`next.config.ts` configures a rewrite to avoid CORS in development:

```
/api/proxy/:path* → ${NEXT_PUBLIC_API_URL}/:path*
```

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
