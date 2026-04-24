# ADR-002 — Atomic Design as Component Architecture

**Status:** Accepted  
**Date:** 2025-01  
**Authors:** Frontend Architecture Team

---

## Context

Without a clear component hierarchy, UI systems grow in complexity in an uncontrolled way. Low-level components start depending on business logic, and high-level components become coupled to rendering details. The result is a system that is hard to test, hard to reuse, and impossible to maintain.

---

## Decision

The project adopts **Atomic Design** with three implemented levels:

```
atoms  ←  molecules  ←  organisms
```

The import rule is absolute: **lower-level components never import from higher levels.**

### Atoms (`src/components/atoms/`)

Primitive UI units. No business logic, no API calls, no store access.

**Can import from:** `models/`, `theme/`, `i18n/`  
**Forbidden to import from:** hooks, facades, stores, MSW, molecules, organisms

**Components:** `Button`, `Badge`, `Input`, `Avatar`, `StatusPill`, `StatusChip`

**Atom criterion:** "Can I use this component in any context without knowing anything about the domain?"

### Molecules (`src/components/molecules/`)

Atom compositions with a single purpose. May have a local UI state (e.g., dropdown open/closed). Use hooks only for data already available via props or context.

**Can import from:** `atoms/`, `models/`, `hooks/`  
**Forbidden to import from:** organisms, facades, MSW

**Components:** `Modal`, `ConfirmDialog`, `NavItem`, `UserMenu`, `ErrorState`, `LanguageSwitcher`, domain form dialogs

**Molecule criterion:** "Does this component have a single, well-defined purpose?"

### Organisms (`src/components/organisms/`)

Complete feature sections. Can use hooks, access server state via TanStack Query, and render multiple molecules and atoms. These are the highest-level components before pages.

**Can import from:** `molecules/`, `atoms/`, `hooks/`, `stores/`  
**Forbidden to import from:** facades, MSW

**Components:** `AdminShell`, `SidebarNav`, `AuthGuard`, `*PageClient`

**Organism criterion:** "Does this component represent a complete functional section of a feature?"

### Auth Components (`src/components/auth/`)

Special category outside the Atomic hierarchy. Not atoms, molecules, or organisms — they are authorization primitives.

**Components:** `Can`, `PermissionsProvider`

---

## Export Pattern

Each component has its own file. Barrel exports via `index.ts` per level:

```typescript
// src/components/atoms/index.ts
export { Button } from "./Button";
export { Badge } from "./Badge";
export { Input } from "./Input";
export { Avatar } from "./Avatar";
export { StatusPill } from "./StatusPill";
export { StatusChip } from "./StatusChip";
```

---

## Consequences

**Positive:**
- Clear, auditable hierarchy (enforceable via linting import boundaries)
- Atoms are 100% testable without API mocks
- Reusability guaranteed by design
- Faster onboarding: "where does X live?" has a deterministic answer

**Negative:**
- Classification decisions can be ambiguous in edge cases
- Refactoring an atom to a molecule requires updating imports

**Mitigation:** When in doubt, classify at the highest level that satisfies the criteria. Document the decision in the PR.

---

## Alternatives Considered

| Alternative                                    | Reason for Rejection                                                       |
|------------------------------------------------|----------------------------------------------------------------------------|
| Feature-based folders                          | Hinders reuse across features; no abstraction hierarchy                    |
| Flat components/                               | No structure; scales poorly                                                |
| Full 5-level Atomic Design (+ templates/pages) | Pages are managed by App Router; templates are unnecessary in this context |
