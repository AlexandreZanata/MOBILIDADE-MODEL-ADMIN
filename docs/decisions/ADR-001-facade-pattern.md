# ADR-001 — Facade Pattern as API Abstraction Layer

**Status:** Accepted  
**Date:** 2025-01  
**Authors:** Frontend Architecture Team

---

## Context

The system needs a clear boundary between UI logic and network communication. Without this boundary, `fetch` calls scattered across components and hooks make the system hard to test, hard to mock, and impossible to audit.

Additionally, the system uses MSW in development and tests, but the real API in production. This swap must be transparent to the entire UI layer.

---

## Decision

All network communication is centralized in **facades** — one TypeScript file per domain in `src/facades/`. No component, hook, or store may call `fetch` directly.

### Facade Structure

```typescript
// src/facades/cargosFacade.ts

import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { resolveApiBase } from "@/lib/apiBase";
import type { Cargo } from "@/models/Cargo";
import type { CreateCargoInput, UpdateCargoInput } from "@/types/cargos";

export const cargosFacade = {
  list: async (): Promise<Cargo[]> => {
    const res = await fetch(`${resolveApiBase()}/cargos`);
    return handleEnvelopedResponse<Cargo[]>(res);
  },

  create: async (input: CreateCargoInput): Promise<Cargo> => {
    const res = await fetch(`${resolveApiBase()}/cargos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<Cargo>(res);
  },

  update: async (id: string, input: UpdateCargoInput): Promise<Cargo> => {
    const res = await fetch(`${resolveApiBase()}/cargos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<Cargo>(res);
  },

  deactivate: async (id: string): Promise<void> => {
    const res = await fetch(`${resolveApiBase()}/cargos/${id}`, {
      method: "DELETE",
    });
    return handleEnvelopedResponse<void>(res);
  },
};
```

### API Envelope

All endpoints return:

```typescript
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
```

`handleEnvelopedResponse()` unwraps the envelope and throws `ApiError` on HTTP failure.

### Authentication

`authFacade` is special: it manages JWT tokens in `sessionStorage` and implements automatic refresh with a mutex pattern to prevent duplicate refresh calls.

```typescript
// Mutex pattern in authFacade
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
}
```

---

## Consequences

**Positive:**
- Testability: MSW intercepts the real `fetch`, no module stubbing needed
- Auditability: every network call has a traceable entry point
- Transparent swap: dev uses MSW, prod uses real API, no code changes
- Full typing: facades are fully typed, no `any`

**Negative:**
- One extra layer of indirection for simple operations
- Each new domain requires a new facade file

**Mitigation:** The indirection cost is low compared to the testability and auditability gains in a mission-critical system.

---

## Alternatives Considered

| Alternative              | Reason for Rejection                                        |
|--------------------------|-------------------------------------------------------------|
| Direct fetch in hooks    | Untestable without module stubbing; no audit point          |
| Axios with interceptors  | Extra dependency; MSW works better with native fetch        |
| React Query with inline queryFn | Network logic scattered; hard to reuse across queries |
| tRPC                     | Requires TypeScript backend; not applicable to this context |
