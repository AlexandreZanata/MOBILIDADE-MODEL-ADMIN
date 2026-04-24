# GovMobile Admin — Domain Models

> Reference for all domain types and enums.  
> Location: `src/models/` — leaf module (imports nothing).

---

## The Leaf Module Rule

Domain models are the lowest layer of the system. They **import from no other project module**. Any other module may import from `models/`, but `models/` imports from no one.

---

## Auth (`src/models/Auth.ts`)

```typescript
export interface AuthUser {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface LoginInput {
  cpf: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  cpf: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
```

---

## User (`src/models/User.ts`)

```typescript
export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  DISPATCHER = "DISPATCHER",
  AGENT = "AGENT",
}
```

---

## Permission (`src/models/Permission.ts`)

```typescript
export enum Permission {
  // Runs
  VIEW_RUNS = "VIEW_RUNS",
  OVERRIDE_RUN = "OVERRIDE_RUN",

  // Job Titles
  CARGO_VIEW = "CARGO_VIEW",
  CARGO_CREATE = "CARGO_CREATE",
  CARGO_UPDATE = "CARGO_UPDATE",
  CARGO_DELETE = "CARGO_DELETE",

  // Assignments
  LOTACAO_VIEW = "LOTACAO_VIEW",
  LOTACAO_CREATE = "LOTACAO_CREATE",
  LOTACAO_UPDATE = "LOTACAO_UPDATE",
  LOTACAO_DELETE = "LOTACAO_DELETE",

  // Departments
  DEPARTMENT_VIEW = "DEPARTMENT_VIEW",
  DEPARTMENT_CREATE = "DEPARTMENT_CREATE",

  // Staff
  SERVIDOR_VIEW = "SERVIDOR_VIEW",
  SERVIDOR_CREATE = "SERVIDOR_CREATE",
  SERVIDOR_UPDATE = "SERVIDOR_UPDATE",
  SERVIDOR_DELETE = "SERVIDOR_DELETE",

  // Drivers
  MOTORISTA_VIEW = "MOTORISTA_VIEW",
  MOTORISTA_CREATE = "MOTORISTA_CREATE",
  MOTORISTA_UPDATE = "MOTORISTA_UPDATE",
  MOTORISTA_DEACTIVATE = "MOTORISTA_DEACTIVATE",

  // Vehicles
  VEICULO_VIEW = "VEICULO_VIEW",
  VEICULO_CREATE = "VEICULO_CREATE",
  VEICULO_UPDATE = "VEICULO_UPDATE",
  VEICULO_DEACTIVATE = "VEICULO_DEACTIVATE",

  // Users
  USER_VIEW = "USER_VIEW",
  USER_CREATE = "USER_CREATE",
  USER_UPDATE = "USER_UPDATE",
  USER_DEACTIVATE = "USER_DEACTIVATE",

  // Audit
  AUDIT_VIEW = "AUDIT_VIEW",
}
```

---

## Cargo / Job Title (`src/models/Cargo.ts`)

```typescript
export interface Cargo {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Lotacao / Assignment (`src/models/Lotacao.ts`)

```typescript
export interface Lotacao {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}
```

---

## Department (`src/models/Department.ts`)

```typescript
export interface Department {
  id: string;
  name: string;
  acronym: string;
  active: boolean;
  createdAt: string;
}
```

---

## Servidor / Staff Member (`src/models/Servidor.ts`)

```typescript
export interface Servidor {
  id: string;
  name: string;
  cpf: string;
  registrationNumber: string;
  email?: string;
  phone?: string;
  cargoId: string;
  cargo?: Cargo;
  lotacaoId: string;
  lotacao?: Lotacao;
  departmentId?: string;
  department?: Department;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Motorista / Driver (`src/models/Motorista.ts`)

```typescript
export interface Motorista {
  id: string;
  name: string;
  cpf: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  phone: string;
  email?: string;
  status: MotoristaStatus;
  active: boolean;
  createdAt: string;
}

export enum MotoristaStatus {
  AVAILABLE = "AVAILABLE",
  ON_DUTY = "ON_DUTY",
  UNAVAILABLE = "UNAVAILABLE",
  SUSPENDED = "SUSPENDED",
}
```

---

## Veiculo / Vehicle (`src/models/Veiculo.ts`)

```typescript
export interface Veiculo {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  type: VeiculoType;
  capacity: number;
  status: VeiculoStatus;
  active: boolean;
  createdAt: string;
}

export enum VeiculoType {
  SEDAN = "SEDAN",
  SUV = "SUV",
  VAN = "VAN",
  BUS = "BUS",
}

export enum VeiculoStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
}
```

---

## Run (`src/models/Run.ts`)

```typescript
export interface Run {
  id: string;
  number: string;
  requesterId: string;
  requester?: Servidor;
  driverId?: string;
  driver?: Motorista;
  vehicleId?: string;
  vehicle?: Veiculo;
  origin: string;
  destination: string;
  status: RunStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum RunStatus {
  REQUESTED = "REQUESTED",
  AWAITING_ACCEPTANCE = "AWAITING_ACCEPTANCE",
  ACCEPTED = "ACCEPTED",
  EN_ROUTE = "EN_ROUTE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}
```

---

## AuditEntry (`src/models/AuditEntry.ts`)

```typescript
export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: string;
  ip?: string;
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  OVERRIDE = "OVERRIDE",
}
```

---

## API Envelope (`src/types/api.ts`)

```typescript
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```
