# Mobilidade Admin

Role-based government operations platform for managing transport runs, drivers, passengers, fleet, and billing. Mission-critical, auditable, and multi-language.

## Tech Stack

| Category      | Technology                        | Version     |
|---------------|-----------------------------------|-------------|
| Framework     | Next.js (App Router)              | ^16.2.4     |
| UI Library    | React                             | 19.2.4      |
| Language      | TypeScript (strict)               | ^5          |
| Styling       | Tailwind CSS                      | ^4          |
| Server State  | TanStack Query                    | ^5.99.0     |
| Client State  | Zustand                           | ^5.0.12     |
| i18n          | i18next + react-i18next           | ^26 / ^17   |
| Mocking (dev) | MSW (Mock Service Worker)         | ^2.13.3     |
| Testing       | Vitest + Testing Library          | ^4 / ^16    |
| Notifications | Sonner                            | ^2.0.7      |
| Icons         | Lucide React                      | ^1.8.0      |

## Prerequisites

- Node.js 18+
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Development with MSW (mock API)
NEXT_PUBLIC_MOCK_MODE=true npm run dev

# Development against a real API
NEXT_PUBLIC_API_URL=https://your-api.com npm run dev

# Production build
npm run build

# Start production server
npm run start
```

The app will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_MOCK_MODE=true
```

| Variable                | Required    | Description                              |
|-------------------------|-------------|------------------------------------------|
| `NEXT_PUBLIC_API_URL`   | Yes (prod)  | Backend API base URL                     |
| `NEXT_PUBLIC_MOCK_MODE` | No          | Set to `"true"` to enable MSW mocking    |

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

## Project Structure

```
├── docs/                  # Technical documentation
│   ├── architecture/      # System overview and domain models
│   ├── decisions/         # Architecture Decision Records (ADRs)
│   ├── design-system/     # Tokens, component catalog
│   ├── implementation/    # Feature guides, auth, testing, i18n
│   ├── product/           # Product overview and use cases
│   └── routes/            # API endpoint documentation (one file per endpoint)
│
└── src/
    ├── app/               # Next.js App Router (route groups, layouts, pages)
    ├── components/
    │   ├── atoms/         # Primitive UI units (Button, Badge, Input...)
    │   ├── molecules/     # Atom compositions (Modal, NavItem, UserMenu...)
    │   ├── organisms/     # Feature sections (AdminShell, *PageClient...)
    │   └── auth/          # Authorization primitives (Can, PermissionsProvider)
    ├── facades/           # Network boundary — one file per domain
    ├── hooks/             # Custom hooks per domain (TanStack Query + Zustand)
    ├── stores/            # Zustand stores (UI/client state only)
    ├── models/            # Domain types and enums (leaf module)
    ├── types/             # Shared TypeScript types
    ├── lib/               # Pure utilities and helpers
    ├── msw/               # MSW handlers (dev/test only)
    ├── i18n/              # i18next config + locales (pt-BR, en)
    ├── theme/             # CSS design tokens + TypeScript references
    ├── config/            # Navigation configuration
    └── test/              # Setup, fixtures, renderWithProviders
```

## Architecture

Data flows in one direction only:

```
UI Component → Custom Hook → Facade → fetch ← MSW (dev) | Real API (prod)
```

- No component or hook calls `fetch` directly
- All network communication goes through the facade layer
- Components follow Atomic Design: atoms → molecules → organisms
- Remote state: TanStack Query — UI state: Zustand (never mixed)
- Permissions enforced via `<Can>` and `usePermissions()` — never inline role checks

## Documentation

Full technical documentation lives in [`docs/`](./docs/README.md):

- [Architecture Overview](./docs/architecture/overview.md)
- [Domain Models](./docs/architecture/domain-models.md)
- [ADR-001 — Facade Pattern](./docs/decisions/ADR-001-facade-pattern.md)
- [ADR-002 — Atomic Design](./docs/decisions/ADR-002-atomic-design.md)
- [ADR-003 — State Management](./docs/decisions/ADR-003-state-management.md)
- [Design System — Tokens](./docs/design-system/tokens.md)
- [Design System — Components](./docs/design-system/components.md)
- [Feature Implementation Guide](./docs/implementation/feature-guide.md)
- [Auth & Permissions](./docs/implementation/auth-and-permissions.md)
- [Testing Guide](./docs/implementation/testing-guide.md)
- [i18n Guide](./docs/implementation/i18n-guide.md)
- [API Reference](./docs/README.md#api-reference)
