# GovMobile Admin — Internationalization (i18n) Guide

---

## Configuration

- **Supported languages:** `pt-BR` (default) and `en`
- **Persisted preference:** `localStorage("govmobile.language")`
- **Automatic fallback:** `pt-BR`
- **Library:** i18next + react-i18next (`^26` / `^17`)

---

## File Structure

```
src/i18n/
├── config.ts              # i18next initialization
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── auth.json
    │   ├── nav.json
    │   ├── runs.json
    │   ├── cargos.json
    │   ├── lotacoes.json
    │   ├── departments.json
    │   ├── servidores.json
    │   ├── motoristas.json
    │   ├── veiculos.json
    │   ├── users.json
    │   └── audit.json
    └── pt-BR/
        └── (same 12 files)
```

---

## Namespaces

| Namespace     | Content                                           |
|---------------|---------------------------------------------------|
| `common`      | Global actions (Save, Cancel, Edit, loading)      |
| `auth`        | Login, registration, authentication errors        |
| `nav`         | Sidebar navigation labels                         |
| `runs`        | Runs, run status                                  |
| `cargos`      | Government job titles                             |
| `lotacoes`    | Staff assignments                                 |
| `departments` | Departments                                       |
| `servidores`  | Government staff members                          |
| `motoristas`  | Drivers                                           |
| `veiculos`    | Vehicles                                          |
| `users`       | System users (access accounts)                    |
| `audit`       | Audit trail                                       |

---

## Standard Domain Namespace Structure

```json
{
  "page": {
    "title": "Page Name",
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
    "view": "View",
    "reactivate": "Reactivate"
  },
  "fields": {
    "name": "Name",
    "status": "Status",
    "createdAt": "Created at"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive"
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
  },
  "modal": {
    "createTitle": "New Record",
    "editTitle": "Edit Record",
    "viewTitle": "Record Details",
    "deleteTitle": "Deactivate Record",
    "deleteDescription": "This action cannot be undone. Do you want to continue?"
  },
  "table": {
    "columns": {
      "name": "Name",
      "status": "Status",
      "actions": "Actions"
    }
  }
}
```

---

## Usage in Components

```typescript
// Single namespace
const { t: tCargos } = useTranslation("cargos");
tCargos("page.title") // → "Job Titles"

// Multiple namespaces
const { t: tMulti } = useTranslation(["cargos", "common"]);
tMulti("cargos:page.title")
tMulti("common:actions.save")

// With interpolation
tCargos("toast.created", { name: cargo.name })
// JSON: "toast.created": "Job title \"{{name}}\" created successfully."
```

---

## Mandatory Rules

1. **Zero hardcoded strings** — every user-visible text goes through `t()`
2. **Namespace per domain** — never put everything in `common`
3. **Descriptive keys** — `"page.empty.title"` not `"emptyTitle"`
4. **Always keep pt-BR and en in sync** — PRs must include both
5. **Never use `i18n.language` for business logic** — only for formatting

---

## Date and Number Formatting

Use native browser APIs with the i18n locale:

```typescript
const { i18n } = useTranslation();

// Date
new Intl.DateTimeFormat(i18n.language, {
  dateStyle: "short",
  timeStyle: "short",
}).format(new Date(entry.timestamp));

// Currency
new Intl.NumberFormat(i18n.language, {
  style: "currency",
  currency: "BRL",
}).format(amount);
```
