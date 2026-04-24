# GovMobile Admin — Architecture Overview

> **Version:** 2.0.0  
> **Status:** Living document — update with every accepted ADR  
> **Audience:** Frontend engineers, tech leads, PR reviewers

---

## What is GovMobile Admin

GovMobile Admin is a role-based government operations panel (RBAC). It is a mission-critical, auditable, multi-language application built for operators working under pressure. Every architectural decision prioritizes **operational clarity**, **security**, and **maintainability** above all else.

---

## Tech Stack

| Category        | Technology                   | Version      | Rationale                                          |
|-----------------|------------------------------|--------------|----------------------------------------------------|
| Framework       | Next.js (App Router)         | ^16.2.4      | SSR, route groups, native loading boundaries       |
| UI Library      | React                        | 19.2.4       | Concurrent features, Server Components             |
| Language        | TypeScript                   | ^5 (strict)  | Zero `any`, type safety across the entire codebase |
| Styling         | Tailwind CSS                 | ^4           | Token-driven, no external CSS, full tree-shaking   |
| Server State    | TanStack Query               | ^5.99.0      | Cache, invalidation, retry, devtools               |
| Client State    | Zustand                      | ^5.0.12      | Minimal, no boilerplate, no Redux                  |
| i18n            | i18next + react-i18next      | ^26 / ^17    | pt-BR default, automatic fallback, namespaces      |
| Mocking (dev)   | MSW (Mock Service Worker)    | ^2.13.3      | Intercepts real fetch, no module stubbing          |
| Testing         | Vitest + Testing Library     | ^4 / ^16     | Vite-compatible, Jest-like API                     |
| Notifications   | Sonner                       | ^2.0.7       | Accessible toast, richColors, bottom-right         |
| Icons           | Lucide React                 | ^1.8.0       | Inline SVG, tree-shakeable, consistent             |
| Property Tests  | fast-check                   | 4.6.0        | Property-based testing for domain models           |
| Linting         | ESLint (Next.js + TS)        | ^9           | Zero warnings required in CI                       |

---

## Architectural Principles

### 1. Unidirectional Data Flow

```
UI Component
    ↓
Custom Hook  (TanStack Query / Zustand)
    ↓
Facade       (single network contact point)
    ↓
fetch ←→ MSW (dev/test) | Real API (prod)
```

**Absolute rule:** no component or hook calls `fetch` directly. All network communication goes through the facade layer.

### 2. Strict Atomic Design

```
atoms  ←  molecules  ←  organisms  ←  pages
```

Lower-level components **never** import from higher levels. Atoms don't know about hooks. Molecules don't know about organisms.

### 3. State Separation

| State Type         | Tool               | Examples                          |
|--------------------|--------------------|-----------------------------------|
| Remote data        | TanStack Query     | Lists, details, audit trail       |
| Mutations          | TanStack Query     | Create, edit, delete              |
| Filters / modals   | Zustand            | Local UI state                    |
| Session / role     | Zustand authStore  | Authenticated user                |
| Forms              | React local state  | Controlled fields                 |
| Pagination/filters | Next.js searchParams| Shareable via URL                 |

### 4. Permissions via System, Never Inline

```tsx
// ✅ Correct
<Can perform={Permission.CARGO_CREATE}>
  <Button>Create Role</Button>
</Can>

// ❌ Forbidden
if (user.role === "ADMIN") { ... }
```

### 5. Zero Hardcoded Strings

Every user-visible text goes through `useTranslation()`. No exceptions.

---

## Folder Structure

```
govmobile-admin/
├── public/
│   └── mockServiceWorker.js       # MSW worker (generated via npx msw init)
│
├── docs/                          # Technical documentation (this directory)
│   ├── architecture/              # Overview, ADRs, diagrams
│   ├── design-system/             # Tokens, components, visual philosophy
│   ├── decisions/                 # Numbered ADRs
│   ├── implementation/            # Feature guides per domain
│   └── product/                   # Product overview and use cases
│
└── src/
    ├── app/                       # Next.js App Router
    │   ├── (admin)/               # Route group — authenticated panel
    │   │   ├── layout.tsx         # AdminShell + AuthGuard + PermissionsProvider
    │   │   ├── audit/page.tsx
    │   │   ├── cargos/page.tsx
    │   │   ├── departments/page.tsx
    │   │   ├── fleet/
    │   │   │   ├── drivers/page.tsx
    │   │   │   └── vehicles/page.tsx
    │   │   ├── assignments/page.tsx
    │   │   ├── runs/page.tsx
    │   │   ├── staff/page.tsx
    │   │   └── users/page.tsx
    │   ├── (auth)/                # Route group — login/register
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── layout.tsx             # Root layout (fonts, MSWProvider, Providers)
    │   ├── page.tsx               # Redirect → /runs or /login
    │   ├── providers.tsx          # QueryClient + i18n providers
    │   └── globals.css            # @import tailwindcss + govmobile.css
    │
    ├── components/
    │   ├── atoms/                 # Button, Badge, Input, Avatar, StatusPill, StatusChip
    │   ├── molecules/             # Modal, ConfirmDialog, NavItem, UserMenu, ErrorState...
    │   ├── organisms/             # AdminShell, SidebarNav, AuthGuard, *PageClient...
    │   └── auth/                  # Can, PermissionsProvider
    │
    ├── facades/                   # One file per domain (single network boundary)
    ├── hooks/                     # Custom hooks per domain
    ├── stores/                    # Zustand stores
    ├── models/                    # Domain types and enums (leaf module)
    ├── types/                     # Shared TypeScript types
    ├── lib/                       # Pure utilities and helpers
    ├── msw/                       # MSW handlers (dev/test only)
    ├── i18n/                      # i18next config + locales (pt-BR, en)
    ├── theme/                     # CSS design tokens + TypeScript references
    ├── config/                    # Navigation configuration
    └── test/                      # Setup, fixtures, renderWithProviders
```

---

## Module Boundaries

| Module    | Can import from                             | Forbidden to import from       |
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

## Import Rules

```typescript
// ✅ Correct — absolute alias
import { Button } from "@/components/atoms/Button";
import { cargosKeys } from "@/lib/queryKeys/cargosKeys";

// ❌ Forbidden — relative import crossing modules
import { Button } from "../../../components/atoms/Button";

// ❌ Forbidden — direct fetch in component or hook
fetch("/api/runs");

// ❌ Forbidden — hardcoded role check
if (user.role === "ADMIN") { ... }

// ❌ Forbidden — importing MSW outside src/msw/ and src/test/
import { runHandlers } from "@/msw/runHandlers"; // inside a component
```

---

## Environment Variables

| Variable                  | Required    | Usage                                   |
|---------------------------|-------------|-----------------------------------------|
| `NEXT_PUBLIC_API_URL`     | Yes (prod)  | Backend API base URL                    |
| `NEXT_PUBLIC_MOCK_MODE`   | No          | `"true"` enables MSW in development     |

---

## NPM Scripts

```bash
npm run dev        # Next.js dev server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint (zero warnings)
npm run typecheck  # tsc --noEmit
npm run test       # Vitest --run (single execution)
npm run test:watch # Vitest in watch mode
npm run validate   # lint + typecheck + test (CI gate)
```

---

## API Proxy (Development)

`next.config.ts` configures a rewrite to avoid CORS in development:

```
/api/proxy/:path* → ${NEXT_PUBLIC_API_URL}/:path*
```

---

## References

- [ADR-001 — Facade Pattern](../decisions/ADR-001-facade-pattern.md)
- [ADR-002 — Atomic Design](../decisions/ADR-002-atomic-design.md)
- [ADR-003 — Zustand + TanStack Query](../decisions/ADR-003-state-management.md)
- [Design System — Tokens](../design-system/tokens.md)
- [Feature Implementation Guide](../implementation/feature-guide.md)
