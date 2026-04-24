# ADR-003 — Zustand + TanStack Query (no Redux)

**Status:** Accepted  
**Date:** 2025-01  
**Authors:** Frontend Architecture Team

---

## Context

The system needs to manage two fundamentally different types of state:

1. **Remote state:** data that lives on the server (lists, details, audit trail). Has a cache lifecycle, needs invalidation, retry, and synchronization.
2. **UI state:** data that lives only on the client (active filters, open modals, user session). Has no cache lifecycle.

Mixing these two types in a single solution (e.g., Redux with thunks) creates unnecessary complexity and makes reasoning about the system harder.

---

## Decision

### Remote State → TanStack Query

TanStack Query manages all state that comes from the server:

```typescript
// src/hooks/cargos/useCargos.ts
export function useCargos() {
  return useQuery({
    queryKey: cargosKeys.list(),
    queryFn: () => cargosFacade.list(),
  });
}

export function useCreateCargo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("cargos");

  return useMutation({
    mutationFn: (input: CreateCargoInput) => cargosFacade.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cargosKeys.all });
      toast.success(t("toast.created"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
```

**Global configuration:**

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

### UI State → Zustand

Zustand manages all states that live only on the client:

```typescript
// src/stores/authStore.ts
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  redirectUrl: string | null;
  setUser: (user: AuthUser | null) => void;
  setRedirectUrl: (url: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  redirectUrl: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, isHydrated: true }),
  setRedirectUrl: (url) => set({ redirectUrl: url }),
  clear: () => set({ user: null, isAuthenticated: false, redirectUrl: null }),
}));
```

### Query Key Factories (mandatory)

All queries use the factory pattern to guarantee precise invalidation:

```typescript
// src/lib/queryKeys/cargosKeys.ts
export const cargosKeys = {
  all: ["cargos"] as const,
  list: () => [...cargosKeys.all, "list"] as const,
  detail: (id: string) => [...cargosKeys.all, "detail", id] as const,
};
```

### Two-Layer Model

| State Type            | Tool                  | Examples                             |
|-----------------------|-----------------------|--------------------------------------|
| Remote data           | TanStack Query        | Lists, details, audit trail          |
| Mutations             | TanStack Query        | Create, edit, delete records         |
| Active filters        | Zustand               | Table filters                        |
| Modal state           | Zustand               | Dialog open/close                    |
| Session / role        | Zustand (authStore)   | Authenticated user, isAuthenticated  |
| Form state            | React local state     | Controlled fields                    |
| URL state             | Next.js searchParams  | Pagination, shareable filters        |

---

## Usage Rules

1. **Never mix responsibilities:** TanStack Query does not manage UI state; Zustand does not manage remote data.
2. **Never access stores in facades:** facades are stateless.
3. **Never access facades in stores:** stores are stateless with respect to the network.
4. **Query keys always via factory:** never inline string literals.

---

## Consequences

**Positive:**
- Clear separation of responsibilities
- TanStack Query eliminates loading/error/cache boilerplate
- Zustand is minimal — no actions, reducers, or dispatchers
- Devtools available for both tools

**Negative:**
- Two systems to learn (mitigated by clarity of responsibilities)
- Risk of using the wrong tool for the wrong type of state

**Mitigation:** The rule "server data = TanStack Query, UI data = Zustand" is simple and auditable.

---

## Alternatives Considered

| Alternative                | Reason for Rejection                                     |
|----------------------------|----------------------------------------------------------|
| Redux Toolkit              | Excessive boilerplate; no native cache for server state  |
| Jotai                      | Atomic model makes coordinated query invalidation harder |
| Context API for everything | Unnecessary re-renders; no cache; no devtools            |
| SWR                        | Fewer features than TanStack Query; no native mutations  |
