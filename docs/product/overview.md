# GovMobile Admin — Product Overview

---

## What It Is

GovMobile Admin is a role-based government operations panel (RBAC). It allows government teams to manage transport runs, staff members, drivers, vehicles, assignments, and job titles in a unified, auditable, multi-language interface.

---

## Functional Domains

| Domain      | Route               | Description                                            |
|-------------|---------------------|--------------------------------------------------------|
| Runs        | `/runs`             | Transport runs — view and override                     |
| Job Titles  | `/cargos`           | Government staff job titles                            |
| Assignments | `/assignments`      | Staff-to-department assignments                        |
| Departments | `/departments`      | Organization departments                               |
| Staff       | `/staff`            | Government staff members                               |
| Drivers     | `/fleet/drivers`    | Fleet drivers                                          |
| Vehicles    | `/fleet/vehicles`   | Fleet vehicles                                         |
| Users       | `/users`            | System users (access accounts)                         |
| Audit       | `/audit`            | Audit trail for all system actions                     |

---

## Roles and Capabilities

| Role         | Runs | Job Titles | Assignments | Staff | Drivers | Vehicles | Users | Audit |
|--------------|------|------------|-------------|-------|---------|----------|-------|-------|
| ADMIN        | ✅ RW | ✅ RW     | ✅ RW       | ✅ RW | ✅ RW   | ✅ RW    | ✅ RW | ✅ R  |
| SUPERVISOR   | ✅ R  | ✅ R      | ✅ R        | ✅ RW | ✅ RW   | ✅ R     | ❌    | ✅ R  |
| DISPATCHER   | ✅ RW | ❌        | ❌          | ❌    | ✅ R    | ✅ R     | ❌    | ❌    |
| AGENT        | ✅ R  | ❌        | ❌          | ❌    | ❌      | ❌       | ❌    | ❌    |

R = Read, W = Write (create/update/delete)

---

## Primary Use Cases

### Dispatcher — Manage Runs

1. Accesses `/runs`
2. Views in-progress, pending, and completed runs
3. Can override a run (reassign driver, cancel)
4. All actions are recorded in the audit trail

### Supervisor — Manage Staff

1. Accesses `/staff`
2. Creates, edits, and deactivates staff members
3. Links staff to assignments and job titles
4. Views assignment history

### Admin — Manage Users

1. Accesses `/users`
2. Creates access accounts with specific roles
3. Deactivates accounts for users who have left the organization
4. Views the audit trail for all system actions

---

## Audit Trail

Every write action (create, update, delete) generates an audit entry with:
- User who performed the action
- Timestamp
- Affected domain
- Action type
- Before and after data (when applicable)

The audit trail is read-only and accessible only to ADMIN and SUPERVISOR roles.

---

## Internationalization

The system supports `pt-BR` (default) and `en`. The preference is saved per user in `localStorage`. The entire interface, including error messages and notifications, is translated.
