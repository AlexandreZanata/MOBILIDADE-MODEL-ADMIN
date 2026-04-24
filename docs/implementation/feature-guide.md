# GovMobile Admin — Feature Implementation Guide

> Checklist and mandatory patterns for implementing any new feature in the system.

---

## Definition of Done Checklist

Before opening a PR, verify:

- [ ] `tsc --noEmit` with no errors
- [ ] `npm run lint` with no warnings
- [ ] No hardcoded text (everything via `useTranslation()`)
- [ ] No hardcoded colors or radius (everything via tokens)
- [ ] Layer separation respected (UI → Hook → Facade)
- [ ] Facade implemented (mock + real API)
- [ ] Permissions correctly applied via `<Can>` and `usePermissions()`
- [ ] Tests covering: loading, success, error, main interaction
- [ ] Query keys via factory pattern
- [ ] Conventional Commit with correct scope

---

## Step-by-Step: Implementing a New Domain

### 1. Domain Model (`src/models/`)

```typescript
// src/models/MyDomain.ts
// Leaf module — imports nothing

export interface MyDomain {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}
```

### 2. API Types (`src/types/`)

```typescript
// src/types/myDomain.ts
import type { MyDomain } from "@/models/MyDomain";

export interface CreateMyDomainInput {
  name: string;
}

export interface UpdateMyDomainInput {
  name?: string;
  active?: boolean;
}

export type MyDomainListResponse = MyDomain[];
```

### 3. Query Keys (`src/lib/queryKeys/`)

```typescript
// src/lib/queryKeys/myDomainKeys.ts
export const myDomainKeys = {
  all: ["myDomain"] as const,
  list: () => [...myDomainKeys.all, "list"] as const,
  detail: (id: string) => [...myDomainKeys.all, "detail", id] as const,
};
```

### 4. Facade (`src/facades/`)

```typescript
// src/facades/myDomainFacade.ts
import { handleEnvelopedResponse } from "@/lib/handleApiResponse";
import { resolveApiBase } from "@/lib/apiBase";
import type { MyDomain } from "@/models/MyDomain";
import type { CreateMyDomainInput, UpdateMyDomainInput } from "@/types/myDomain";

export const myDomainFacade = {
  list: async (): Promise<MyDomain[]> => {
    const res = await fetch(`${resolveApiBase()}/my-domain`);
    return handleEnvelopedResponse<MyDomain[]>(res);
  },

  create: async (input: CreateMyDomainInput): Promise<MyDomain> => {
    const res = await fetch(`${resolveApiBase()}/my-domain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<MyDomain>(res);
  },

  update: async (id: string, input: UpdateMyDomainInput): Promise<MyDomain> => {
    const res = await fetch(`${resolveApiBase()}/my-domain/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleEnvelopedResponse<MyDomain>(res);
  },

  deactivate: async (id: string): Promise<void> => {
    const res = await fetch(`${resolveApiBase()}/my-domain/${id}`, {
      method: "DELETE",
    });
    return handleEnvelopedResponse<void>(res);
  },
};
```

### 5. MSW Handler (`src/msw/`)

```typescript
// src/msw/myDomainHandlers.ts
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { myDomainFixtures } from "@/test/fixtures/myDomain";

export const myDomainHandlers = [
  http.get(`${resolveApiBase()}/my-domain`, () => {
    return HttpResponse.json({
      success: true,
      data: myDomainFixtures,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${resolveApiBase()}/my-domain`, async ({ request }) => {
    const body = await request.json() as { name: string };
    const created = {
      id: crypto.randomUUID(),
      name: body.name,
      active: true,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(
      { success: true, data: created, timestamp: new Date().toISOString() },
      { status: 201 }
    );
  }),
];
```

### 6. Test Fixtures (`src/test/fixtures/`)

```typescript
// src/test/fixtures/myDomain.ts
import type { MyDomain } from "@/models/MyDomain";

export const myDomainFixtures: MyDomain[] = [
  { id: "1", name: "Domain Alpha", active: true, createdAt: "2025-01-01T00:00:00Z" },
  { id: "2", name: "Domain Beta", active: false, createdAt: "2025-01-02T00:00:00Z" },
];
```

### 7. Hooks (`src/hooks/myDomain/`)

```typescript
// src/hooks/myDomain/useMyDomain.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { myDomainFacade } from "@/facades/myDomainFacade";
import { myDomainKeys } from "@/lib/queryKeys/myDomainKeys";
import type { CreateMyDomainInput } from "@/types/myDomain";

export function useMyDomain() {
  return useQuery({
    queryKey: myDomainKeys.list(),
    queryFn: () => myDomainFacade.list(),
  });
}

export function useCreateMyDomain() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("myDomain");

  return useMutation({
    mutationFn: (input: CreateMyDomainInput) => myDomainFacade.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myDomainKeys.all });
      toast.success(t("toast.created"));
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });
}
```

### 8. Permissions (`src/models/Permission.ts`)

Add the new domain's permissions to the enum:

```typescript
MY_DOMAIN_VIEW = "MY_DOMAIN_VIEW",
MY_DOMAIN_CREATE = "MY_DOMAIN_CREATE",
MY_DOMAIN_UPDATE = "MY_DOMAIN_UPDATE",
MY_DOMAIN_DELETE = "MY_DOMAIN_DELETE",
```

### 9. i18n (`src/i18n/locales/`)

```json
// src/i18n/locales/en/myDomain.json
{
  "page": {
    "title": "My Domain",
    "empty": {
      "title": "No records found",
      "message": "Create the first record to get started."
    },
    "accessDenied": "You do not have permission to access this page."
  },
  "actions": {
    "create": "New Record",
    "edit": "Edit",
    "delete": "Deactivate",
    "view": "View"
  },
  "fields": {
    "name": "Name",
    "status": "Status"
  },
  "toast": {
    "created": "Record created successfully.",
    "updated": "Record updated successfully.",
    "deleted": "Record deactivated successfully.",
    "error": "An error occurred. Please try again."
  },
  "filters": {
    "all": "All",
    "active": "Active",
    "inactive": "Inactive"
  }
}
```

### 10. PageClient Organism (`src/components/organisms/`)

Follow the pattern documented in [components.md](../design-system/components.md#pageclient-organisms).

### 11. Route (`src/app/(admin)/`)

```typescript
// src/app/(admin)/my-domain/page.tsx
import { MyDomainPageClient } from "@/components/organisms/MyDomainPageClient";

export default function MyDomainPage() {
  return <MyDomainPageClient />;
}
```

### 12. Navigation (`src/config/navigation.ts`)

```typescript
{
  key: "my-domain",
  href: "/my-domain",
  labelKey: "nav:myDomain",
  icon: "IconName",
  permission: Permission.MY_DOMAIN_VIEW,
}
```

---

## Test Patterns

### Facade Test

```typescript
// src/facades/__tests__/myDomainFacade.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { myDomainHandlers } from "@/msw/myDomainHandlers";
import { myDomainFacade } from "@/facades/myDomainFacade";

const server = setupServer(...myDomainHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("myDomainFacade", () => {
  it("lists records successfully", async () => {
    const result = await myDomainFacade.list();
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("name");
  });
});
```

### PageClient Test

```typescript
// src/components/organisms/__tests__/MyDomainPageClient.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/test/renderWithProviders";
import { MyDomainPageClient } from "@/components/organisms/MyDomainPageClient";
import { server } from "@/test/server";

describe("MyDomainPageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithProviders(<MyDomainPageClient />);
    expect(screen.getByTestId("my-domain-skeleton")).toBeInTheDocument();
  });

  it("renders records after load", async () => {
    renderWithProviders(<MyDomainPageClient />);
    expect(await screen.findByText("Domain Alpha")).toBeInTheDocument();
  });

  it("shows error state with retry button", async () => {
    server.use(http.get("*/my-domain", () => HttpResponse.error()));
    renderWithProviders(<MyDomainPageClient />);
    expect(await screen.findByTestId("my-domain-error")).toBeInTheDocument();
  });

  it("opens create dialog on button click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyDomainPageClient />);
    await screen.findByText("Domain Alpha");
    await user.click(screen.getByTestId("btn-create-my-domain"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
```

---

## Conventional Commits

Required format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Usage                                            |
|------------|--------------------------------------------------|
| `feat`     | New feature                                      |
| `fix`      | Bug fix                                          |
| `refactor` | Refactoring without behavior change              |
| `docs`     | Documentation                                    |
| `test`     | Adding or fixing tests                           |
| `chore`    | Configuration, build, dependencies               |
| `style`    | Formatting, no logic change                      |
| `perf`     | Performance improvement                          |

### Examples

```
feat(cargos): add cargo deactivation with reason field

Implements ConfirmDialog with optional reason input.
Adds useDeactivateCargo mutation with optimistic update.

Closes #42
```

```
fix(auth): prevent duplicate refresh token calls with mutex

Adds refreshPromise guard to authFacade to prevent
race conditions when multiple requests fail with 401.
```

```
docs(architecture): add ADR-004 for i18n namespace strategy
```
