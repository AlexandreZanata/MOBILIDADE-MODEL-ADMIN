# GovMobile Admin — Testing Guide

---

## Testing Stack

| Tool                        | Version | Usage                                        |
|-----------------------------|---------|----------------------------------------------|
| Vitest                      | ^4      | Unit and integration test runner             |
| @testing-library/react      | ^16     | Component rendering and interaction          |
| @testing-library/jest-dom   | —       | DOM matchers (toBeInTheDocument, etc.)       |
| @testing-library/user-event | —       | Realistic user event simulation              |
| MSW (node)                  | ^2      | API mocking in tests                         |
| fast-check                  | 4.6.0   | Property-based testing for domain models     |

---

## Configuration

### Global Setup

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
```

### renderWithProviders

Mandatory wrapper for all component tests:

```typescript
// src/test/renderWithProviders.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

### i18n Mock

```typescript
// src/test/i18n-mock.ts
// Mocks i18next for component tests
// Returns the translation key as the value (simplifies assertions)
```

---

## Minimum Coverage Requirements

| Layer        | Minimum      |
|--------------|--------------|
| Atoms        | 100%         |
| Molecules    | 90%          |
| Hooks        | 90% branches |
| Facades      | 95%          |
| Models/utils | 100%         |
| Overall      | 80%          |

---

## Test File Locations

Tests are colocated with the code they test:

```
src/components/atoms/__tests__/
src/components/molecules/__tests__/
src/components/organisms/__tests__/
src/facades/__tests__/
src/hooks/__tests__/
src/hooks/<domain>/__tests__/
src/models/__tests__/
src/msw/__tests__/
```

---

## Test Patterns by Layer

### Atoms

Tests focus on:
- Rendering all variants
- States (loading, disabled, error)
- Accessibility (aria-*, role)
- Basic interactions (click, focus)

```typescript
describe("Button", () => {
  it("renders primary variant", () => {
    renderWithProviders(<Button variant="primary">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-brand-primary");
  });

  it("shows spinner when isLoading", () => {
    renderWithProviders(<Button isLoading>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("is disabled when isLoading", () => {
    renderWithProviders(<Button isLoading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Facades

Tests focus on:
- Correct HTTP calls (method, URL, body)
- API envelope unwrapping
- ApiError thrown on failure

```typescript
const server = setupServer(...myDomainHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("myDomainFacade.list", () => {
  it("returns list on success", async () => {
    const result = await myDomainFacade.list();
    expect(result).toHaveLength(2);
  });

  it("throws ApiError on 404", async () => {
    server.use(http.get("*/my-domain", () => HttpResponse.json({}, { status: 404 })));
    await expect(myDomainFacade.list()).rejects.toBeInstanceOf(ApiError);
  });
});
```

### Hooks

Tests focus on:
- Initial state (loading)
- Success state (correct data)
- Error state (ApiError propagated)
- Cache invalidation after mutations

```typescript
describe("useMyDomain", () => {
  it("returns loading state initially", () => {
    const { result } = renderHook(() => useMyDomain(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useMyDomain(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });
});
```

### PageClient Organisms

Tests focus on:
- Loading state (skeleton visible)
- Success state (data rendered)
- Error state (ErrorState with retry)
- Interactions: open modal, filter, search
- Permissions: create button hidden without permission

```typescript
describe("MyDomainPageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithProviders(<MyDomainPageClient />);
    expect(screen.getByTestId("my-domain-skeleton")).toBeInTheDocument();
  });

  it("renders data after load", async () => {
    renderWithProviders(<MyDomainPageClient />);
    expect(await screen.findByText("Domain Alpha")).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
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

### Property-Based Tests (fast-check)

For models and utilities with mathematical invariants:

```typescript
// src/models/__tests__/contracts.test.ts
import fc from "fast-check";

describe("CPF validation", () => {
  it("never accepts strings shorter than 11 digits", () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 10 }).filter(s => /^\d+$/.test(s)),
        (cpf) => !isValidCpf(cpf)
      )
    );
  });
});
```

---

## NPM Scripts

```bash
npm run test          # Vitest --run (single execution, for CI)
npm run test:watch    # Vitest in watch mode (development)
npm run validate      # lint + typecheck + test (CI gate)
```

---

## Best Practices

1. **Never use `screen.getByText` for i18n text** — use `data-testid` or semantic roles
2. **Always use `userEvent` instead of `fireEvent`** for realistic interactions
3. **Always reset MSW handlers** in `afterEach` to prevent test leakage
4. **Never test implementation** — test observable behavior from the user's perspective
5. **Centralized fixtures** in `src/test/fixtures/` — never duplicate test data
