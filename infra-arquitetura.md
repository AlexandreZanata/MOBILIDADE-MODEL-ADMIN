# GovMobile Admin — Infraestrutura e Arquitetura Completa

> Documento gerado automaticamente a partir da análise do repositório.
> Projeto: `govmobile-admin` · Stack: Next.js 16 · React 19 · TypeScript 5

---

## Stack Tecnológica

| Categoria         | Tecnologia                        | Versão     |
|-------------------|-----------------------------------|------------|
| Framework         | Next.js (App Router)              | ^16.2.4    |
| UI Library        | React                             | 19.2.4     |
| Linguagem         | TypeScript                        | ^5         |
| Estilização       | Tailwind CSS                      | ^4         |
| Server State      | TanStack Query                    | ^5.99.0    |
| Client State      | Zustand                           | ^5.0.12    |
| i18n              | i18next + react-i18next           | ^26 / ^17  |
| Mocking (dev)     | MSW (Mock Service Worker)         | ^2.13.3    |
| Testes            | Vitest + Testing Library          | ^4 / ^16   |
| Notificações      | Sonner                            | ^2.0.7     |
| Ícones            | Lucide React                      | ^1.8.0     |
| Property Testing  | fast-check                        | 4.6.0      |
| Linting           | ESLint (Next.js + TypeScript)     | ^9         |

---

## Estrutura de Pastas

```
govmobile-admin/
├── public/                        # Assets estáticos + Service Worker do MSW
│   └── mockServiceWorker.js       # Worker do MSW (gerado automaticamente)
│
├── docs/                          # Documentação técnica e de produto
│   ├── architecture/              # System design e diagramas
│   ├── decisions/                 # ADRs (Architecture Decision Records)
│   ├── design-pattern/            # Padrões de interação e performance
│   ├── design-system/             # Tokens, componentes e filosofia visual
│   ├── implementation/            # Guias de próximos passos por feature
│   ├── product/                   # Overview e casos de uso
│   └── ux/                        # Fluxos de usuário
│
└── src/
    ├── app/                       # Next.js App Router
    │   ├── (admin)/               # Route group — painel autenticado
    │   ├── (auth)/                # Route group — login/registro
    │   ├── layout.tsx             # Root layout (fontes, CSS global, providers)
    │   ├── page.tsx               # Redirect para /runs ou /login
    │   ├── providers.tsx          # TanStack Query + i18n providers
    │   └── globals.css            # CSS global
    │
    ├── components/                # Componentes UI (Atomic Design)
    │   ├── atoms/                 # Unidades primitivas de UI
    │   ├── molecules/             # Composições de atoms
    │   ├── organisms/             # Seções de feature completas
    │   └── auth/                  # Componentes de autorização (Can, PermissionsProvider)
    │
    ├── facades/                   # Camada de abstração de API (um arquivo por domínio)
    ├── hooks/                     # Custom hooks React (TanStack Query + Zustand)
    ├── stores/                    # Zustand stores (estado client-side)
    ├── models/                    # Tipos de domínio e enums
    ├── types/                     # Tipos TypeScript compartilhados
    ├── lib/                       # Utilitários e helpers
    ├── msw/                       # Handlers MSW para mock de API
    ├── i18n/                      # Configuração i18next e arquivos de locale
    ├── theme/                     # Design tokens e CSS customizado
    ├── config/                    # Configurações de navegação
    └── test/                      # Utilitários de teste, fixtures e setup
```

---

## Arquitetura em Camadas

O fluxo de dados é unidirecional e obrigatório:

```
UI Component → Custom Hook → Facade → fetch ← MSW (dev/test) | API Real (prod)
```

Nenhum componente ou hook pode chamar `fetch` diretamente.

### Camada 1 — UI Components (`src/components/`)

Seguem o padrão **Atomic Design**:

| Nível     | Pasta                       | Responsabilidade                       | Pode importar de                            |
|-----------|-----------------------------|----------------------------------------|---------------------------------------------|
| Atoms     | `src/components/atoms/`     | Unidades primitivas (Button, Badge...) | `models/`, `theme/`, `i18n/`                |
| Molecules | `src/components/molecules/` | Composições com propósito único        | `atoms/`, `models/`, `hooks/`               |
| Organisms | `src/components/organisms/` | Seções de feature com dados reais      | `molecules/`, `atoms/`, `hooks/`, `stores/` |

Regra de ouro: **componentes de nível inferior nunca importam de nível superior.**

### Camada 2 — Custom Hooks (`src/hooks/`)

Orquestram dados via TanStack Query e Zustand. Organizados por domínio:

```
src/hooks/
├── auth/          # useLogin, useLogout, useCurrentUser, usePermissions...
├── cargos/        # useCargos, useCreateCargo, useUpdateCargo, useDeleteCargo...
├── departments/   # useDepartments, useCreateDepartment
├── lotacoes/      # useCreateLotacao, useDeleteLotacao, useReativarLotacao...
├── motoristas/    # useMotoristas, useCreateMotorista, useDesativarMotorista...
├── runs/          # useRuns, useOverrideRunMutation
├── servidores/    # useServidores, useCreateServidor, useDeleteServidor...
├── users/         # useUsers, useCreateUser, useDeactivateUser...
├── veiculos/      # useVeiculos, useCreateVeiculo, useDesativarVeiculo...
├── useAuditTrail.ts
└── useLotacoes.ts
```

### Camada 3 — Facades (`src/facades/`)

Único ponto de contato com a rede. Um arquivo por domínio:

```
src/facades/
├── authFacade.ts        # login, logout, me, refresh, register, activate
├── auditFacade.ts
├── cargosFacade.ts
├── departmentsFacade.ts
├── lotacoesFacade.ts
├── motoristasFacade.ts
├── runsFacade.ts
├── servidoresFacade.ts
├── usersFacade.ts
└── veiculosFacade.ts
```

O `authFacade` gerencia tokens JWT em `sessionStorage` e implementa refresh automático com padrão mutex (evita chamadas duplicadas de refresh).

### Camada 4 — MSW / API Real

Em desenvolvimento (`NEXT_PUBLIC_MOCK_MODE=true`), o MSW intercepta todos os `fetch`. Em produção, as chamadas vão direto para a API.

---

## Rotas (Next.js App Router)

### Route Groups

```
src/app/
├── (auth)/                    # Layout mínimo, sem sidebar
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (admin)/                   # Layout com AdminShell (sidebar + topbar)
│   ├── layout.tsx             # Injeta PermissionsProvider + AuthGuard
│   ├── audit/page.tsx
│   ├── cargos/page.tsx
│   ├── departments/page.tsx
│   ├── frota/
│   │   ├── motoristas/page.tsx
│   │   └── veiculos/page.tsx
│   ├── lotacoes/page.tsx
│   ├── runs/page.tsx
│   ├── servidores/page.tsx
│   └── users/page.tsx
│
├── layout.tsx                 # Root layout (fontes Geist, Toaster, MSWProvider, Providers)
└── page.tsx                   # Redirect
```

Cada rota de admin possui também um `loading.tsx` para Suspense boundaries automáticos do Next.js.

### Proxy de API

O `next.config.ts` configura um rewrite para evitar CORS em desenvolvimento:

```
/api/proxy/:path* → ${NEXT_PUBLIC_API_URL}/:path*
```

---

## Estado da Aplicação

### Modelo de Dois Layers (ADR-003)

| Tipo de Estado        | Ferramenta            | Exemplos                             |
|-----------------------|-----------------------|--------------------------------------|
| Dados remotos         | TanStack Query        | Listas, detalhes, audit trail        |
| Mutações              | TanStack Query        | Criar, editar, deletar registros     |
| Filtros ativos        | Zustand               | Filtros de tabela                    |
| Estado de modais      | Zustand               | Abertura/fechamento de dialogs       |
| Sessão / role         | Zustand (`authStore`) | Usuário autenticado, isAuthenticated |
| Estado de formulários | React local state     | Campos controlados                   |
| Estado de URL         | Next.js searchParams  | Paginação, filtros compartilháveis   |

### TanStack Query — Configuração Global

```typescript
// src/app/providers.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,   // 5 minutos
      gcTime: 10 * 60_000,     // 10 minutos
      retry: 1,
    },
  },
})
```

### Query Key Factories (`src/lib/queryKeys/`)

Padrão obrigatório para todas as queries:

```typescript
export const cargosKeys = {
  all: ["cargos"] as const,
  list: () => [...cargosKeys.all, "list"] as const,
  detail: (id: string) => [...cargosKeys.all, "detail", id] as const,
};
```

Arquivos existentes: `auditKeys`, `cargosKeys`, `departmentsKeys`, `lotacoesKeys`, `motoristasKeys`, `runsKeys`, `servidoresKeys`, `usersKeys`, `veiculosKeys`.

### Zustand Store (`src/stores/authStore.ts`)

Único store atual. Gerencia:
- `user: AuthUser | null`
- `isAuthenticated: boolean`
- `isHydrated: boolean` — distingue "carregando" de "não autenticado"
- `redirectUrl: string | null` — URL para redirect pós-login

---

## Autenticação e Sessão

- Tokens JWT armazenados em `sessionStorage` (sobrevive a refresh, limpo ao fechar a aba)
- `authFacade` gerencia `accessToken` e `refreshToken` em memória de módulo
- Refresh automático com mutex: se já há um refresh em andamento, chamadas subsequentes aguardam a mesma Promise
- Em caso de falha no refresh, tokens são limpos e o erro é propagado
- `AuthGuard` (organism) protege todas as rotas admin
- `PermissionsProvider` injeta o role do usuário no contexto de permissões

---

## Sistema de Permissões

```typescript
// Verificação via hook
const { can } = usePermissions();
if (can(Permission.CARGO_VIEW)) { ... }

// Verificação via componente
<Can perform={Permission.USER_VIEW}>
  <UsersTable />
</Can>
```

Permissões são definidas em `src/models/Permission.ts`. Hardcoded role checks (`user.role === "ADMIN"`) são proibidos em componentes.

---

## Internacionalização (i18n)

- Idiomas suportados: `pt-BR` (padrão) e `en`
- Preferência salva em `localStorage` (`govmobile.language`)
- Fallback automático para `pt-BR`
- Namespaces: `common`, `runs`, `auth`, `users`, `nav`, `cargos`, `lotacoes`, `departments`, `audit`, `motoristas`, `servidores`, `veiculos`

```
src/i18n/
├── config.ts              # Inicialização do i18next
└── locales/
    ├── en/                # 12 arquivos JSON
    └── pt-BR/             # 12 arquivos JSON
```

---

## Design System e Tema

### Tokens (`src/theme/tokens.ts`)

Referências a variáveis CSS HSL definidas em `govmobile.css`:

- `tokens.colors.brand.primary/secondary`
- `tokens.colors.semantic.success/warning/danger/info`
- `tokens.colors.neutral.50` → `900`
- `tokens.radius.sm/md/lg/full`
- `tokens.font.sans/mono`

### CSS Global

- `src/app/globals.css` — reset e variáveis base
- `src/theme/govmobile.css` — variáveis CSS customizadas do design system
- Fontes: Geist Sans + Geist Mono (Google Fonts via `next/font`)
- Estilização: Tailwind CSS v4 (via `@tailwindcss/postcss`)

---

## Mock Service Worker (MSW)

Ativo quando `NEXT_PUBLIC_MOCK_MODE=true`. O `MSWProvider` aguarda o worker estar pronto antes de renderizar a aplicação (evita race conditions).

```
src/msw/
├── browser.ts             # Setup do worker com todos os handlers
├── authHandlers.ts
├── auditHandlers.ts
├── cargosHandlers.ts
├── departmentsHandlers.ts
├── lotacoesHandlers.ts
├── motoristasHandlers.ts
├── runsHandlers.ts
├── servidoresHandlers.ts
└── usersHandlers.ts
```

O arquivo `public/mockServiceWorker.js` é o service worker registrado no browser.

---

## Modelos de Domínio (`src/models/`)

Tipos e enums de domínio — módulo folha (não importa de nada):

| Arquivo          | Conteúdo                                      |
|------------------|-----------------------------------------------|
| `Auth.ts`        | `AuthUser`, `LoginInput`, `RegisterInput`, `TokenPair` |
| `User.ts`        | `User`, `UserRole` (ADMIN, SUPERVISOR, DISPATCHER, AGENT) |
| `Permission.ts`  | Enum `Permission` com todas as permissões     |
| `Cargo.ts`       | `Cargo`, status de cargo                      |
| `Lotacao.ts`     | `Lotacao`                                     |
| `Department.ts`  | `Department`                                  |
| `Motorista.ts`   | `Motorista`                                   |
| `Servidor.ts`    | `Servidor`                                    |
| `Veiculo.ts`     | `Veiculo`                                     |
| `Run.ts`         | `Run`, `RunStatus`                            |
| `AuditEntry.ts`  | `AuditEntry`                                  |

---

## Tipos Compartilhados (`src/types/`)

- `api.ts` — `ApiError` (classe), `ApiErrorPayload`
- `auth.ts`, `runs.ts`, `cargos.ts`, `lotacoes.ts`, `audit.ts`, `veiculos.ts`, `motoristas.ts`, `servidores.ts`, `departments.ts`, `users.ts`

### Envelope de API

Todos os endpoints de domínio retornam:

```typescript
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
```

Desempacotado automaticamente por `handleEnvelopedResponse()` em `src/lib/handleApiResponse.ts`.

---

## Utilitários (`src/lib/`)

| Arquivo                        | Função                                              |
|--------------------------------|-----------------------------------------------------|
| `apiBase.ts`                   | Resolve a URL base da API (`NEXT_PUBLIC_API_URL`)   |
| `handleApiResponse.ts`         | Parse de respostas HTTP + throw de `ApiError`       |
| `buildServidorUpdatePayload.ts`| Constrói payload de update de servidor              |
| `cpfUtils.ts`                  | Validação de CPF                                    |
| `formatCpf.ts`                 | Formatação de CPF (000.000.000-00)                  |
| `phoneUtils.ts`                | Utilitários de telefone                             |
| `filterByAtivo.ts`             | Filtro de registros ativos/inativos                 |

---

## Infraestrutura de Testes

### Ferramentas

| Ferramenta                    | Uso                                          |
|-------------------------------|----------------------------------------------|
| Vitest                        | Runner de testes unitários e integração      |
| @testing-library/react        | Renderização e interação com componentes     |
| @testing-library/jest-dom     | Matchers DOM                                 |
| @testing-library/user-event   | Simulação realista de eventos de usuário     |
| MSW (node)                    | Mock de API nos testes                       |
| fast-check                    | Property-based testing                       |

### Configuração

- `src/test/setup.ts` — importa `@testing-library/jest-dom` globalmente
- `src/test/renderWithProviders.tsx` — wrapper com `QueryClientProvider` (retry: false)
- `src/test/i18n-mock.ts` — mock do i18n para testes de componentes

### Fixtures (`src/test/fixtures/`)

Dados de teste centralizados, usados pelos handlers MSW e pelos testes:

```
src/test/fixtures/
├── audit.ts
├── cargos.ts
├── departments.ts
├── lotacoes.ts
├── motoristas.ts
├── runs.ts
├── servidores.ts
└── users.ts
```

### Localização dos Testes

```
src/components/atoms/__tests__/
├── atoms.test.tsx
└── StatusChip.test.tsx

src/components/molecules/__tests__/
├── CargoViewModal.test.tsx
├── LotacaoViewModal.test.tsx
├── RunOverrideDialog.test.tsx
└── UserMenu.test.tsx

src/components/organisms/__tests__/
├── AdminShell.test.tsx
├── AuditPageClient.test.tsx
├── CargosPageClient.test.tsx
├── DepartmentsPageClient.test.tsx
├── LotacoesPageClient.test.tsx
├── MotoristasPageClient.test.tsx
├── RunsPageClient.test.tsx
└── UsersPageClient.test.tsx

src/facades/__tests__/
├── cargosFacade.test.ts
├── motoristasFacade.test.ts
└── servidoresFacade.test.ts

src/hooks/__tests__/
├── useCreateMotorista.test.ts
├── useLotacoes.test.ts
└── useMotoristas.test.ts

src/hooks/cargos/__tests__/
├── cargosMutations.test.ts
└── useCargos.test.ts

src/hooks/lotacoes/__tests__/
└── lotacoesMutations.test.ts

src/hooks/motoristas/__tests__/
└── motoristasHooks.test.ts

src/hooks/runs/__tests__/
└── useRuns.test.ts

src/models/__tests__/
├── cargo.contract.test.ts
└── contracts.test.ts

src/msw/__tests__/
├── cargosHandlers.test.ts
├── lotacoesHandlers.test.ts
└── motoristasHandlers.test.ts
```

### Cobertura Mínima Exigida

| Camada       | Mínimo       |
|--------------|--------------|
| Atoms        | 100%         |
| Molecules    | 90%          |
| Hooks        | 90% branches |
| Facades      | 95%          |
| Models/utils | 100%         |
| Geral        | 80%          |

### Scripts de Teste

```bash
npm run test          # Vitest --run (execução única)
npm run test:watch    # Vitest em modo watch
npm run validate      # lint + typecheck + test
```

---

## Variáveis de Ambiente

| Variável                  | Uso                                              |
|---------------------------|--------------------------------------------------|
| `NEXT_PUBLIC_API_URL`     | URL base da API backend                          |
| `NEXT_PUBLIC_MOCK_MODE`   | `"true"` ativa o MSW em desenvolvimento          |

---

## Scripts NPM

```bash
npm run dev        # Next.js dev server (localhost)
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # ESLint (zero warnings)
npm run typecheck  # tsc --noEmit
npm run test       # Vitest --run
npm run validate   # lint + typecheck + test
```

---

## ADRs (Architecture Decision Records)

| ADR     | Decisão                                    | Status   |
|---------|--------------------------------------------|----------|
| ADR-001 | Facade Pattern como camada de abstração    | Aceito   |
| ADR-002 | Atomic Design como arquitetura de componentes | Aceito |
| ADR-003 | Zustand + TanStack Query (sem Redux)       | Aceito   |

---

## Regras de Importação

```typescript
// ✅ Correto — alias absoluto
import { Button } from "@/components/atoms/Button";

// ❌ Proibido — import relativo cruzando módulos
import { Button } from "../../../components/atoms/Button";

// ❌ Proibido — fetch direto em componente ou hook
fetch("/api/runs");

// ❌ Proibido — role check hardcoded em componente
if (user.role === "ADMIN") { ... }

// ❌ Proibido — importar MSW fora de src/msw/ e src/test/
import { runHandlers } from "@/msw/runHandlers"; // em componente
```

---

## Fronteiras de Módulo

| Módulo    | Pode importar de                            | Proibido importar de           |
|-----------|---------------------------------------------|--------------------------------|
| Atoms     | `models/`, `theme/`, `i18n/`                | hooks, facades, stores, MSW    |
| Molecules | `atoms/`, `models/`, `hooks/`               | organisms, facades, MSW        |
| Organisms | `molecules/`, `atoms/`, `hooks/`, `stores/` | facades, MSW                   |
| Hooks     | `facades/`, `stores/`, `models/`            | components, MSW                |
| Facades   | `types/`, `models/`, `lib/`                 | components, hooks, stores, MSW |
| Stores    | `models/`, `types/`                         | components, hooks, facades     |
| MSW       | `models/`, `types/`, `test/fixtures/`       | components, hooks, facades     |
| Models    | nada                                        | tudo                           |
