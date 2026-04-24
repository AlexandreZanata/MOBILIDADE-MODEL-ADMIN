# GovMobile Admin — Authentication, Session & Permissions

---

## Authentication

### Login Flow

```
LoginForm
  → useLogin (hook)
    → authFacade.login(cpf, password)
      → POST /auth/login
        → { accessToken, refreshToken }
    → authFacade.storeTokens(tokens)
    → authStore.setUser(user)
  → redirect to /runs
```

### Token Storage

- `accessToken` and `refreshToken` stored in `sessionStorage`
- Survive page refresh
- Automatically cleared when the tab is closed (native sessionStorage behavior)
- Never exposed in cookies or localStorage

### Automatic Refresh with Mutex

`authFacade` implements automatic refresh with a mutex pattern to prevent duplicate calls:

```typescript
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // If a refresh is already in progress, wait for the same Promise
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}
```

On refresh failure:
1. Tokens are cleared from sessionStorage
2. `authStore.clear()` is called
3. The error is propagated to `AuthGuard`
4. `AuthGuard` redirects to `/login?reason=session_expired`

### Auth Endpoints

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| POST   | `/auth/login`     | Login with CPF + password      |
| POST   | `/auth/logout`    | Invalidates tokens on server   |
| GET    | `/auth/me`        | Returns authenticated user     |
| POST   | `/auth/refresh`   | Renews accessToken             |
| POST   | `/auth/register`  | New user registration          |
| POST   | `/auth/activate`  | Account activation             |

---

## AuthGuard

`AuthGuard` is an organism that protects all routes in the `(admin)` group. It is rendered in `src/app/(admin)/layout.tsx`.

### Verification Logic

```typescript
// AuthGuard pseudocode
const { data: user, isLoading, isError, error } = useCurrentUser();

if (isLoading || !isHydrated) return <Skeleton />;

if (isError) {
  if (error instanceof ApiError && error.status === 401) {
    redirect("/login?reason=session_expired");
  }
  if (error instanceof ApiError && error.code === "NETWORK_ERROR") {
    return <ErrorState onRetry={refetch} />;
  }
  return <ErrorState onRetry={refetch} />;
}

if (!user) return <Skeleton />; // waiting for query to stabilize

return (
  <PermissionsProvider role={user.role}>
    {children}
  </PermissionsProvider>
);
```

---

## Permission System

### RBAC Model

The system uses Role-Based Access Control (RBAC) with four roles:

| Role         | Description                                  |
|--------------|----------------------------------------------|
| `ADMIN`      | Full system access                           |
| `SUPERVISOR` | Manages staff, drivers, and runs             |
| `DISPATCHER` | Manages runs and assignments                 |
| `AGENT`      | Limited read-only access                     |

### Permission Enum

All permissions are defined in `src/models/Permission.ts`. See [Domain Models](../architecture/domain-models.md#permission-srcmodelspermissionts) for the full enum.

### Role → Permission Mapping

Defined in `src/lib/permissions.ts`:

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission), // all permissions

  [UserRole.SUPERVISOR]: [
    Permission.VIEW_RUNS,
    Permission.CARGO_VIEW,
    Permission.LOTACAO_VIEW,
    Permission.DEPARTMENT_VIEW,
    Permission.SERVIDOR_VIEW,
    Permission.SERVIDOR_CREATE,
    Permission.SERVIDOR_UPDATE,
    Permission.MOTORISTA_VIEW,
    Permission.MOTORISTA_CREATE,
    Permission.MOTORISTA_UPDATE,
    Permission.VEICULO_VIEW,
    Permission.AUDIT_VIEW,
  ],

  [UserRole.DISPATCHER]: [
    Permission.VIEW_RUNS,
    Permission.OVERRIDE_RUN,
    Permission.MOTORISTA_VIEW,
    Permission.VEICULO_VIEW,
  ],

  [UserRole.AGENT]: [
    Permission.VIEW_RUNS,
  ],
};
```

### usePermissions Hook

```typescript
// src/hooks/auth/usePermissions.ts
export function usePermissions() {
  const { role } = usePermissionsContext();

  const can = (permission: Permission): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };

  return { can, role };
}
```

### Can Component

```tsx
// Basic usage
<Can perform={Permission.CARGO_CREATE}>
  <Button>Create Job Title</Button>
</Can>

// With fallback
<Can perform={Permission.USER_VIEW} fallback={<AccessDenied />}>
  <UsersTable />
</Can>

// Programmatic check
const { can } = usePermissions();
if (can(Permission.CARGO_VIEW)) {
  // render content
}
```

---

## Security Rules

1. **Never check role directly in components:**
   ```tsx
   // ❌ Forbidden
   if (user.role === "ADMIN") { ... }

   // ✅ Correct
   <Can perform={Permission.USER_VIEW}>...</Can>
   ```

2. **Never expose tokens in logs or UI state**

3. **Never store tokens in localStorage** (vulnerable to XSS)

4. **Always validate permissions on the server** — the frontend is only the first line of defense

5. **Refresh tokens must be rotated** on every use (implemented in the backend)
