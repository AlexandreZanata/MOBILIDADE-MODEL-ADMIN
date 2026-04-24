# GovMobile Admin — Design System: Component Catalog

> Complete reference for all UI components, their props, variants, and usage patterns.

---

## Atoms

Primitive UI units. No business logic, no API calls.  
**Location:** `src/components/atoms/`

---

### Button

**File:** `src/components/atoms/Button.tsx`  
Implemented with `forwardRef`. Uses `useTranslation("common")` for the loading `aria-label`.

#### Variants

| Variant       | Base Color        | Usage                                        |
|---------------|-------------------|----------------------------------------------|
| `primary`     | `brand-primary`   | Primary action (Save, Confirm, Assign)       |
| `secondary`   | `brand-secondary` | Supporting action (Edit, View)               |
| `ghost`       | Transparent       | Tertiary action (Cancel, Back)               |
| `destructive` | `danger`          | Irreversible action (Delete, Deactivate)     |
| `success`     | `success`         | Positive confirmation                        |

#### Sizes

| Size | Height | Padding | Font        |
|------|--------|---------|-------------|
| `sm` | 32px   | `px-3`  | `text-sm`   |
| `md` | 40px   | `px-4`  | `text-sm`   |
| `lg` | 48px   | `px-6`  | `text-base` |

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  "data-testid"?: string;
}
```

#### Accessibility

- `aria-busy="true"` when `isLoading`
- `aria-label={t("loading")}` when loading
- `focus-visible:ring-2 focus-visible:ring-offset-2` on all variants
- Native `disabled` prevents clicks without JS
- Spinner: inline SVG with `animate-spin`, `aria-hidden="true"`

#### Usage

```tsx
<Button variant="primary" size="md" isLoading={isPending}>
  {t("actions.save")}
</Button>
<Button variant="destructive" onClick={handleDelete}>
  {t("actions.delete")}
</Button>
<Button variant="ghost" onClick={onClose}>
  {t("actions.cancel")}
</Button>
```

---

### Badge

**File:** `src/components/atoms/Badge.tsx`  
Inline semantic chip. Does not use i18n — receives text as `children`.

#### Variants

| Variant   | Background       | Text               |
|-----------|------------------|--------------------|
| `success` | `bg-success/15`  | `text-success`     |
| `warning` | `bg-warning/15`  | `text-warning`     |
| `danger`  | `bg-danger/15`   | `text-danger`      |
| `info`    | `bg-info/15`     | `text-info`        |
| `neutral` | `bg-neutral-200` | `text-neutral-700` |

Base style: `rounded-full px-2.5 py-0.5 text-xs font-medium`

#### Usage

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>
<Badge variant="warning">SUPERVISOR</Badge>
```

---

### Input

**File:** `src/components/atoms/Input.tsx`  
Input field with integrated label, error message, and helper text.

#### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  "data-testid"?: string;
}
```

#### Accessibility

- `aria-invalid="true"` when `error` is present
- `aria-describedby` links to error and/or helper text
- Error rendered with `role="alert"` for screen readers
- Label always associated via `htmlFor` / `id` (auto-generated from label if omitted)

#### Visual States

- Normal: `border-neutral-300 focus:ring-brand-primary`
- Error: `border-danger focus:ring-danger`
- Disabled: `cursor-not-allowed opacity-50`

#### Usage

```tsx
<Input
  label={t("fields.name")}
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
  helperText={t("fields.nameHelper")}
  data-testid="input-name"
/>
```

---

### Avatar

**File:** `src/components/atoms/Avatar.tsx`  
Circular avatar with image or initials fallback.

#### Initials Logic

First letters of the first two words of the name:
- `"John Smith"` → `"JS"`
- `"Admin"` → `"A"`

#### Sizes

| Size | Dimensions | Font        |
|------|------------|-------------|
| `sm` | 32×32px    | `text-xs`   |
| `md` | 40×40px    | `text-sm`   |
| `lg` | 56×56px    | `text-base` |

Default background: `bg-brand-secondary text-white`

#### Accessibility

- `role="img"` + `aria-label={name}` on wrapper
- `alt={name}` on image

#### Usage

```tsx
<Avatar name="John Smith" size="sm" />
<Avatar name="Maria Santos" src="/avatar.jpg" size="md" />
```

---

### StatusPill

**File:** `src/components/atoms/StatusPill.tsx`  
Colored pill for run status (`RunStatus`). Label resolved via i18n `runs:status.<STATUS>`.

#### Status Mapping

| Status               | Tailwind Classes                          |
|----------------------|-------------------------------------------|
| `REQUESTED`          | `bg-warning/15 text-warning`              |
| `AWAITING_ACCEPTANCE`| `bg-info/15 text-info`                    |
| `ACCEPTED`           | `bg-info/15 text-info`                    |
| `EN_ROUTE`           | `bg-brand-primary/15 text-brand-primary`  |
| `COMPLETED`          | `bg-success/15 text-success`              |
| `CANCELLED`          | `bg-danger/15 text-danger`                |
| `EXPIRED`            | `bg-neutral-200 text-neutral-700`         |

Fallback for unknown status: `bg-neutral-200 text-neutral-700`

#### Usage

```tsx
<StatusPill status={run.status} data-testid="run-status" />
```

---

### StatusChip

**File:** `src/components/atoms/StatusChip.tsx`  
Generic semantic chip with support for interactive mode (button).

**Difference from Badge:** StatusChip uses i18n to resolve the label; Badge receives text directly.  
**Difference from StatusPill:** StatusChip is generic (any domain); StatusPill is specific to `RunStatus`.

#### Interactive Mode

When `interactive=true`, renders as `<button>` with `aria-pressed` and `disabled` support.

#### Usage

```tsx
// Static
<StatusChip variant="success" namespace="cargos" labelKey="status.active" />

// Interactive (filter toggle)
<StatusChip
  variant="info"
  interactive
  pressed={filter === "assigned"}
  onClick={() => setFilter("assigned")}
  labelKey="status.ASSIGNED"
  namespace="runs"
/>
```

---

## Molecules

Atom compositions with a single purpose.  
**Location:** `src/components/molecules/`

---

### Modal

**File:** `src/components/molecules/Modal.tsx`  
Base container for all system modals.

#### Visual Structure

```
Overlay: fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-[2px]
Panel:   rounded-2xl border border-neutral-200 bg-white shadow-xl
  ├── Header: title + optional subtitle + X button
  ├── Body: overflow-y-auto (scrollable)
  └── Footer: optional, separated by border
```

#### Behaviors

- Closes on `Escape` key
- Closes on backdrop click
- Locks body scroll while open
- `aria-modal="true"` + `role="dialog"` + `aria-labelledby`

#### Props

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // default: "max-w-lg"
}
```

#### Usage

```tsx
<Modal
  open={isOpen}
  onClose={handleClose}
  title={t("modal.editTitle")}
  maxWidth="max-w-4xl"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={handleClose}>{t("actions.cancel")}</Button>
      <Button variant="primary" type="submit" form="cargo-form">{t("actions.save")}</Button>
    </div>
  }
>
  <form id="cargo-form">...</form>
</Modal>
```

---

### ConfirmDialog

**File:** `src/components/molecules/ConfirmDialog.tsx`  
Confirmation dialog for destructive actions.

#### Features

- Closes on `Escape`
- Returns focus to `triggerRef` on close
- Confirm button with `autoFocus`
- Support for custom reason field via `reasonField` prop
- All text via i18n (configurable namespace)

#### Props

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  namespace: string;
  titleKey: string;
  descriptionKey?: string;
  confirmLabelKey: string;
  cancelLabelKey: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  reasonField?: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement>;
}
```

---

### ErrorState

**File:** `src/components/molecules/ErrorState.tsx`  
Standardized error state with retry button.

Visual: `rounded-md border border-danger/30 bg-danger/10 p-4` with `aria-live="polite"`.

```tsx
<ErrorState onRetry={() => void refetch()} data-testid="cargos-error" />
```

---

### NavItem

**File:** `src/components/molecules/NavItem.tsx`  
Sidebar navigation link.

- Detects active route via `usePathname()` → `aria-current="page"`
- Prefetches route on mount via `router.prefetch()`
- Collapsed: icon only with `title` for native tooltip

#### Visual States

| State    | Classes                                                    |
|----------|------------------------------------------------------------|
| Active   | `bg-brand-primary/10 text-brand-primary`                   |
| Inactive | `text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900` |

---

### LanguageSwitcher

**File:** `src/components/molecules/LanguageSwitcher.tsx`  
Compact button (32×32px) with active language flag.

- Opens dropdown with `role="listbox"` for language selection
- Persists choice in `localStorage("govmobile.language")`
- Closes on outside click (`mousedown` listener on document)
- Languages: `pt-BR` (🇧🇷) and `en` (🇺🇸)

---

### UserMenu

**File:** `src/components/molecules/UserMenu.tsx`  
User identity block at the bottom of the sidebar. Composes `Avatar` + `Badge` (role) + logout button.

#### Role to Badge Mapping

| Role         | Badge Variant |
|--------------|---------------|
| `ADMIN`      | `danger`      |
| `SUPERVISOR` | `warning`     |
| `DISPATCHER` | `info`        |
| `AGENT`      | `neutral`     |

Collapsed mode: shows only the `Avatar`.

---

### Domain Form Dialogs

Each domain has its own form dialogs:

| File                       | Domain     | Mutations                              |
|----------------------------|------------|----------------------------------------|
| `CargoFormDialog.tsx`      | Job Titles | `useCreateCargo`, `useUpdateCargo`     |
| `LotacaoFormDialog.tsx`    | Assignments| `useCreateLotacao`, `useUpdateLotacao` |
| `DepartmentFormDialog.tsx` | Departments| `useCreateDepartment`                  |
| `ServidorFormDialog.tsx`   | Staff      | `useCreateServidor`, `useUpdateServidor`|
| `MotoristaFormDialog.tsx`  | Drivers    | `useCreateMotorista`, `useUpdateMotorista`|
| `VeiculoFormDialog.tsx`    | Vehicles   | `useCreateVeiculo`, `useUpdateVeiculo` |
| `UserFormDialog.tsx`       | Users      | `useCreateUser`, `useUpdateUser`       |
| `RunOverrideDialog.tsx`    | Runs       | `useOverrideRunMutation`               |

**Form dialog pattern:**
- `"create"` or `"edit"` mode via `mode` prop
- Fields pre-populated in edit mode
- Inline validation with error messages on fields
- HTTP error handling: 409 (duplicate) → inline error on name field
- Auto-closes on mutation `onSuccess`
- All text via i18n from the domain namespace

---

## Organisms

Complete feature sections with real data.  
**Location:** `src/components/organisms/`

---

### AdminShell

**File:** `src/components/organisms/AdminShell.tsx`  
Root layout of the admin panel.

```
div.flex.h-screen (bg-neutral-50)
├── SidebarNav (w-60 or w-16 collapsed)
└── div.flex-1
    ├── header.h-14 (border-b bg-white)
    │   ├── h1 "GovMobile Admin"
    │   └── LanguageSwitcher
    └── main#main-content.flex-1.overflow-y-auto.p-6
        └── {children}
```

- Manages sidebar collapse state
- Persists collapse in cookie (`sidebar_collapsed`)
- Reads `user` from `useAuthStore`

---

### SidebarNav

**File:** `src/components/organisms/SidebarNav.tsx`  
Navigation sidebar with animated collapse (`transition-[width] duration-200`).

```
aside (w-60 or w-16, border-r bg-white)
├── Logo/brand (h-14, border-b)
├── nav (flex-1, overflow-y-auto)
│   └── ul > li > <Can> > <NavItem>
├── UserMenu (border-t)
└── Collapse button (border-t)
```

Each nav item is wrapped in `<Can perform={item.permission}>` when a permission is defined.

---

### AuthGuard

**File:** `src/components/organisms/AuthGuard.tsx`  
Session verification wrapper for all admin routes.

| State                     | UI                                                    |
|---------------------------|-------------------------------------------------------|
| `isLoading`               | Animated skeleton (3 `animate-pulse` bars)            |
| `isError` + 401           | Redirect to `/login?reason=session_expired`           |
| `isError` + NETWORK_ERROR | `<ErrorState>` with retry                             |
| Generic `isError`         | `<ErrorState>` with retry                             |
| `user` present            | `<PermissionsProvider role={...}>{children}`          |
| No user, no error         | Skeleton (waiting for query to stabilize)             |

---

### PageClient Organisms

Mandatory pattern for all `*PageClient` components:

```tsx
<Can perform={Permission.DOMAIN_VIEW} fallback={<AccessDenied />}>
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1>{t("page.title")}</h1>
      <Can perform={Permission.DOMAIN_CREATE}>
        <Button onClick={handleOpenCreate}>{t("actions.create")}</Button>
      </Can>
    </div>

    {/* Toolbar */}
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* search + status filters */}
    </div>

    {/* Conditional content */}
    {isLoading && <Skeleton />}
    {isError && <ErrorState onRetry={refetch} />}
    {!filtered.length && <EmptyState />}
    {filtered.length > 0 && <Table />}
  </div>

  {/* Dialogs */}
  <FormDialog open={formOpen} ... />
  <DeleteDialog open={!!deleteTarget} ... />
  <ViewModal open={!!viewTarget} ... />
</Can>
```

#### Existing PageClients

| File                        | Route               | Base Permission   |
|-----------------------------|---------------------|-------------------|
| `CargosPageClient.tsx`      | `/cargos`           | `CARGO_VIEW`      |
| `LotacoesPageClient.tsx`    | `/assignments`      | `LOTACAO_VIEW`    |
| `DepartmentsPageClient.tsx` | `/departments`      | `DEPARTMENT_VIEW` |
| `ServidoresPageClient.tsx`  | `/staff`            | `SERVIDOR_VIEW`   |
| `MotoristasPageClient.tsx`  | `/fleet/drivers`    | `MOTORISTA_VIEW`  |
| `VeiculosPageClient.tsx`    | `/fleet/vehicles`   | `VEICULO_VIEW`    |
| `UsersPageClient.tsx`       | `/users`            | `USER_VIEW`       |
| `RunsPageClient.tsx`        | `/runs`             | `VIEW_RUNS`       |
| `AuditPageClient.tsx`       | `/audit`            | `AUDIT_VIEW`      |

---

## Auth Components

**Location:** `src/components/auth/`

### Can

Render gate based on permission. Uses `usePermissions()` internally.

```tsx
<Can perform={Permission.CARGO_CREATE}>
  <Button>Create Job Title</Button>
</Can>

<Can perform={Permission.USER_VIEW} fallback={<AccessDenied />}>
  <UsersTable />
</Can>
```

### PermissionsProvider

Injects the user's role into the permissions context. Rendered by `AuthGuard` after successful authentication.

```tsx
<PermissionsProvider role={UserRole.SUPERVISOR}>
  {children}
</PermissionsProvider>
```
