# GovMobile Admin — Design System, Estilos e Componentes

> Documento de referência completo sobre estilização, tokens, design system e divisão de componentes.
> Stack: Tailwind CSS v4 · Lucide React · Atomic Design · i18next

---

## Filosofia de Design

O design system do GovMobile é **token-driven e accessibility-first**, construído para ferramentas operacionais de governo. Cada decisão visual serve à clareza operacional, não à estética.

Cinco princípios guiam todas as decisões:

1. Clareza operacional acima de novidade estética — operadores trabalham sob pressão
2. Token-driven — nenhum valor hardcoded em nenhum componente
3. Acessibilidade como requisito primário, não pós-lançamento
4. Role-aware — permissões via `<Can />`, nunca via `user.role === "ADMIN"`
5. Previsível — mesma aparência = mesmo comportamento, sempre

---

## Bibliotecas e Ferramentas

| Ferramenta              | Versão  | Função                                              |
|-------------------------|---------|-----------------------------------------------------|
| Tailwind CSS            | ^4      | Estilização via utility classes                     |
| @tailwindcss/postcss    | ^4      | Plugin PostCSS para Tailwind v4                     |
| Lucide React            | ^1.8.0  | Biblioteca de ícones SVG                            |
| i18next + react-i18next | ^26/^17 | Internacionalização de todos os textos visíveis     |
| Sonner                  | ^2.0.7  | Notificações toast (bottom-right, richColors)       |
| next/font               | —       | Carregamento otimizado das fontes Geist             |

Não há biblioteca de componentes externa (MUI, Chakra, shadcn etc.). Todos os componentes são implementados do zero sobre Tailwind.

---

## Arquivos de Tema

```
src/theme/
├── govmobile.css    # Variáveis CSS (:root) + @theme Tailwind v4
└── tokens.ts        # Referências TypeScript às variáveis CSS

src/app/
└── globals.css      # @import tailwindcss + @import govmobile.css
```

### globals.css

```css
@import "tailwindcss";
@import "../theme/govmobile.css";

body {
  font-family: var(--font-sans, Arial, Helvetica, sans-serif);
  background-color: hsl(var(--color-neutral-50));
  color: hsl(var(--color-neutral-900));
}
```

---

## Tokens de Design

Todos os valores visuais são variáveis CSS HSL definidas em `govmobile.css` e expostos como TypeScript em `tokens.ts`. O Tailwind v4 lê o bloco `@theme` e gera as utility classes correspondentes.

### Cores — Brand

| Token TypeScript        | Variável CSS                | Valor HSL     | Classe Tailwind                               | Uso                                    |
|-------------------------|-----------------------------|---------------|-----------------------------------------------|----------------------------------------|
| `tokens.colors.brand.primary`   | `--color-brand-primary`   | `220 72% 38%` | `bg-brand-primary` / `text-brand-primary`     | Ações primárias, links, focus rings    |
| `tokens.colors.brand.secondary` | `--color-brand-secondary` | `215 30% 52%` | `bg-brand-secondary` / `text-brand-secondary` | Avatares, elementos secundários        |

### Cores — Semânticas

| Token TypeScript              | Variável CSS        | Valor HSL     | Classe Tailwind             | Uso                                        |
|-------------------------------|---------------------|---------------|-----------------------------|--------------------------------------------|
| `tokens.colors.semantic.success` | `--color-success` | `142 71% 35%` | `bg-success` / `text-success` | Status concluído, feedback positivo      |
| `tokens.colors.semantic.warning` | `--color-warning` | `38 92% 48%`  | `bg-warning` / `text-warning` | Em andamento, estados de atenção         |
| `tokens.colors.semantic.danger`  | `--color-danger`  | `0 72% 51%`   | `bg-danger` / `text-danger`   | Ações destrutivas, erros, cancelamentos  |
| `tokens.colors.semantic.info`    | `--color-info`    | `199 89% 42%` | `bg-info` / `text-info`       | Status atribuído, estados informativos   |

### Cores — Escala Neutral

| Token                  | Classe Tailwind      | Uso principal                        |
|------------------------|----------------------|--------------------------------------|
| `neutral.50`           | `bg-neutral-50`      | Background de página                 |
| `neutral.100`          | `bg-neutral-100`     | Hover states, backgrounds sutis      |
| `neutral.200`          | `bg-neutral-200`     | Bordas, divisores, skeleton loading  |
| `neutral.300`          | `border-neutral-300` | Bordas de inputs                     |
| `neutral.400`          | `text-neutral-400`   | Placeholder text                     |
| `neutral.500`          | `text-neutral-500`   | Helper text, labels secundários      |
| `neutral.600`          | `text-neutral-600`   | Texto de corpo secundário            |
| `neutral.700`          | `text-neutral-700`   | Labels, texto de status inativo      |
| `neutral.800`          | `text-neutral-800`   | Texto de corpo primário              |
| `neutral.900`          | `text-neutral-900`   | Headings, texto de alto contraste    |

### Radius

| Token TypeScript      | Variável CSS      | Valor     | Uso                              |
|-----------------------|-------------------|-----------|----------------------------------|
| `tokens.radius.sm`    | `--radius-sm`     | `0.25rem` | Chips pequenos, elementos tight  |
| `tokens.radius.md`    | `--radius-md`     | `0.5rem`  | Botões, inputs, cards            |
| `tokens.radius.lg`    | `--radius-lg`     | `0.75rem` | Modais, painéis                  |
| `tokens.radius.full`  | `--radius-full`   | `9999px`  | Pills, badges, avatares          |

### Tipografia

| Token TypeScript    | Variável CSS    | Fonte      | Uso              |
|---------------------|-----------------|------------|------------------|
| `tokens.font.sans`  | `--font-sans`   | Geist Sans | Todo texto de UI |
| `tokens.font.mono`  | `--font-mono`   | Geist Mono | Código, IDs, timestamps |

As fontes são carregadas via `next/font/google` no `src/app/layout.tsx` e injetadas como variáveis CSS `--font-sans` e `--font-mono`.

### Classes de Status de Corrida

Definidas em `govmobile.css`, usadas exclusivamente pelo `StatusPill`:

```css
.status-pending    { background: neutral-200/100%;  color: neutral-700 }
.status-assigned   { background: info/15%;           color: info        }
.status-in-progress{ background: warning/15%;        color: warning     }
.status-completed  { background: success/15%;        color: success     }
.status-cancelled  { background: danger/15%;         color: danger      }
```

### Como usar tokens no código

```tsx
// Preferido — classes Tailwind geradas pelo @theme
<div className="bg-brand-primary text-white rounded-md">

// Para valores dinâmicos em TypeScript
import { tokens } from "@/theme/tokens";
const style = { color: tokens.colors.semantic.danger };

// Proibido
<div style={{ backgroundColor: "#1a56db" }}>   // hardcoded
<div className="bg-blue-600">                   // cor fora dos tokens
<div style={{ borderRadius: "8px" }}>           // radius hardcoded
```


---

## Atomic Design — Divisão de Componentes

O projeto segue o padrão **Atomic Design** com três níveis implementados:

```
src/components/
├── atoms/          # Unidades primitivas — zero lógica de negócio
├── molecules/      # Composições de atoms com propósito único
├── organisms/      # Seções de feature completas com dados reais
└── auth/           # Componentes de autorização (Can, PermissionsProvider)
```

Regra de importação obrigatória: **componentes de nível inferior nunca importam de nível superior.**

```
atoms  ←  molecules  ←  organisms
```

---

## Atoms (`src/components/atoms/`)

Unidades primitivas de UI. Sem lógica de negócio, sem chamadas de API. Todos são `"use client"` (usam hooks de i18n e event handlers). Exportados via barrel em `index.ts`.

### Button

**Arquivo:** `src/components/atoms/Button.tsx`

Implementado com `forwardRef`. Usa `useTranslation("common")` para o `aria-label` de loading.

**Variantes:**

| Variant       | Cor base          | Uso                                          |
|---------------|-------------------|----------------------------------------------|
| `primary`     | `brand-primary`   | Ação principal (Salvar, Confirmar, Atribuir) |
| `secondary`   | `brand-secondary` | Ação de suporte (Editar, Visualizar)         |
| `ghost`       | Transparente      | Ação terciária (Cancelar, Voltar)            |
| `destructive` | `danger`          | Ação irreversível (Deletar, Desativar)       |
| `success`     | `success`         | Confirmação positiva                         |

**Tamanhos:**

| Size | Altura | Padding  | Font     |
|------|--------|----------|----------|
| `sm` | 32px   | `px-3`   | `text-sm`  |
| `md` | 40px   | `px-4`   | `text-sm`  |
| `lg` | 48px   | `px-6`   | `text-base`|

**Props principais:** `variant`, `size`, `isLoading`, `disabled`, `data-testid`

**Acessibilidade:**
- `aria-busy="true"` quando `isLoading`
- `aria-label={t("loading")}` quando loading
- `focus-visible:ring-2 focus-visible:ring-offset-2` em todos os variantes
- `disabled` nativo previne cliques sem JS

**Spinner de loading:** SVG inline com `animate-spin`, `aria-hidden="true"`

```tsx
<Button variant="primary" size="md" isLoading={isPending}>
  Salvar
</Button>
<Button variant="destructive" onClick={handleDelete}>
  Excluir
</Button>
<Button variant="ghost" onClick={onClose}>
  Cancelar
</Button>
```

---

### Badge

**Arquivo:** `src/components/atoms/Badge.tsx`

Chip semântico inline. Não usa i18n — recebe o texto como `children`.

**Variantes e mapeamento de tokens:**

| Variant   | Background       | Texto              |
|-----------|------------------|--------------------|
| `success` | `bg-success/15`  | `text-success`     |
| `warning` | `bg-warning/15`  | `text-warning`     |
| `danger`  | `bg-danger/15`   | `text-danger`      |
| `info`    | `bg-info/15`     | `text-info`        |
| `neutral` | `bg-neutral-200` | `text-neutral-700` |

Estilo base: `rounded-full px-2.5 py-0.5 text-xs font-medium`

```tsx
<Badge variant="success">Ativo</Badge>
<Badge variant="danger">Inativo</Badge>
<Badge variant="warning">SUPERVISOR</Badge>
```

---

### Input

**Arquivo:** `src/components/atoms/Input.tsx`

Campo de input com label, mensagem de erro e helper text integrados.

**Props principais:** `label`, `error`, `helperText`, `id` (auto-gerado a partir do label se omitido)

**Acessibilidade:**
- `aria-invalid="true"` quando `error` presente
- `aria-describedby` vincula ao erro e/ou helper text
- Erro renderizado com `role="alert"` para screen readers
- Label sempre associado via `htmlFor` / `id`

**Estados visuais:**
- Normal: `border-neutral-300 focus:ring-brand-primary`
- Erro: `border-danger focus:ring-danger`
- Disabled: `cursor-not-allowed opacity-50`

```tsx
<Input
  label="Nome"
  value={nome}
  onChange={(e) => setNome(e.target.value)}
  error={errors.nome}
  helperText="Máximo 100 caracteres"
  data-testid="input-nome"
/>
```

---

### Avatar

**Arquivo:** `src/components/atoms/Avatar.tsx`

Avatar circular com imagem ou fallback de iniciais. Usa `useState` para detectar erro de carregamento da imagem.

**Lógica de iniciais:** Primeiras letras das duas primeiras palavras do nome. `"João Silva"` → `"JS"`, `"Admin"` → `"A"`.

**Tamanhos:**

| Size | Dimensões | Font       |
|------|-----------|------------|
| `sm` | 32×32px   | `text-xs`  |
| `md` | 40×40px   | `text-sm`  |
| `lg` | 56×56px   | `text-base`|

Background padrão: `bg-brand-secondary text-white`

**Acessibilidade:** `role="img"` + `aria-label={name}` no wrapper. `alt={name}` na imagem.

```tsx
<Avatar name="João Silva" size="sm" />
<Avatar name="Maria Santos" src="/avatar.jpg" size="md" />
```

---

### StatusPill

**Arquivo:** `src/components/atoms/StatusPill.tsx`

Pill colorido para status de corrida (`RunStatus`). Label resolvido via i18n `runs:status.<STATUS>`.

**Mapeamento de status:**

| Status              | Classes Tailwind                          |
|---------------------|-------------------------------------------|
| `SOLICITADA`        | `bg-warning/15 text-warning`              |
| `AGUARDANDO_ACEITE` | `bg-info/15 text-info`                    |
| `ACEITA`            | `bg-info/15 text-info`                    |
| `EM_ROTA`           | `bg-brand-primary/15 text-brand-primary`  |
| `CONCLUIDA`         | `bg-success/15 text-success`              |
| `CANCELADA`         | `bg-danger/15 text-danger`                |
| `EXPIRADA`          | `bg-neutral-200 text-neutral-700`         |

Fallback para status desconhecido: `bg-neutral-200 text-neutral-700`

**Acessibilidade:** `aria-label` com o texto traduzido do status.

```tsx
<StatusPill status={run.status} data-testid="run-status" />
```

---

### StatusChip

**Arquivo:** `src/components/atoms/StatusChip.tsx`

Chip semântico genérico com suporte a modo interativo (botão). Mais flexível que `StatusPill` — aceita qualquer `labelKey` de i18n.

**Diferença do Badge:** StatusChip usa i18n para resolver o label; Badge recebe o texto diretamente.

**Diferença do StatusPill:** StatusChip é genérico (qualquer domínio); StatusPill é específico para `RunStatus`.

**Modo interativo:** Quando `interactive=true`, renderiza como `<button>` com `aria-pressed` e suporte a `disabled`.

```tsx
// Estático
<StatusChip variant="success" namespace="cargos" labelKey="status.active" />

// Interativo (filtro toggle)
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

### Barrel Export (`atoms/index.ts`)

```typescript
export { Button, Badge, Input, Avatar, StatusPill, StatusChip } from "@/components/atoms";
```


---

## Molecules (`src/components/molecules/`)

Composições de atoms com propósito único. Podem ter estado local de UI (ex: dropdown aberto/fechado), mas sem chamadas de API diretas. Usam hooks apenas para dados já disponíveis via props ou contexto.

### Modal

**Arquivo:** `src/components/molecules/Modal.tsx`

Container base para todos os modais do sistema. Todos os form dialogs e confirmation dialogs usam este componente como wrapper.

**Estrutura visual:**
- Overlay: `fixed inset-0 z-50` com backdrop `bg-neutral-900/50 backdrop-blur-[2px]`
- Painel: `rounded-2xl border border-neutral-200 bg-white shadow-xl`
- Header: título + subtítulo opcional + botão X
- Body: scrollável (`overflow-y-auto`)
- Footer: opcional, separado por borda

**Comportamentos:**
- Fecha com tecla `Escape`
- Fecha ao clicar no backdrop
- Bloqueia scroll do body enquanto aberto (`document.body.style.overflow = "hidden"`)
- `aria-modal="true"` + `role="dialog"` + `aria-labelledby` no heading

**Props:** `open`, `onClose`, `title`, `subtitle?`, `children`, `footer?`, `maxWidth?` (default: `"max-w-lg"`)

```tsx
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Editar Cargo"
  maxWidth="max-w-4xl"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
      <Button variant="primary" type="submit" form="cargo-form">Salvar</Button>
    </div>
  }
>
  <form id="cargo-form">...</form>
</Modal>
```

---

### ConfirmDialog

**Arquivo:** `src/components/molecules/ConfirmDialog.tsx`

Dialog de confirmação para ações destrutivas. Não usa `Modal` — implementa seu próprio overlay mais simples (`rounded-lg border border-neutral-300`).

**Características:**
- Fecha com `Escape`
- Retorna foco ao `triggerRef` ao fechar
- Botão de confirmação com `autoFocus`
- Suporte a campo de razão customizado via `reasonField` prop
- Todos os textos via i18n (namespace configurável)

**Props:** `open`, `onClose`, `onConfirm`, `namespace`, `titleKey`, `descriptionKey?`, `confirmLabelKey`, `cancelLabelKey`, `confirmDisabled?`, `confirmLoading?`, `reasonField?`, `triggerRef?`

---

### ErrorState

**Arquivo:** `src/components/molecules/ErrorState.tsx`

Estado de erro padronizado com botão de retry. Usado em todos os PageClient organisms quando `isError=true`.

Visual: `rounded-md border border-danger/30 bg-danger/10 p-4` com `aria-live="polite"`.

```tsx
<ErrorState onRetry={() => void refetch()} data-testid="cargos-error" />
```

---

### NavItem

**Arquivo:** `src/components/molecules/NavItem.tsx`

Link de navegação da sidebar. Detecta rota ativa via `usePathname()` e aplica `aria-current="page"`. Faz prefetch da rota no mount via `router.prefetch()`.

**Estados visuais:**
- Ativo: `bg-brand-primary/10 text-brand-primary`
- Inativo: `text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900`
- Colapsado: apenas ícone (`justify-center`), label no `title` para tooltip nativo

---

### LanguageSwitcher

**Arquivo:** `src/components/molecules/LanguageSwitcher.tsx`

Botão compacto (32×32px) com flag do idioma ativo. Abre dropdown com `role="listbox"` para seleção de idioma. Persiste a escolha em `localStorage("govmobile.language")`.

Idiomas: `pt-BR` (🇧🇷) e `en` (🇺🇸).

Fecha ao clicar fora (listener `mousedown` no document).

---

### UserMenu

**Arquivo:** `src/components/molecules/UserMenu.tsx`

Bloco de identidade do usuário na base da sidebar. Compõe `Avatar` + `Badge` (role) + botão de logout.

**Mapeamento de role para variante de Badge:**

| Role         | Badge Variant |
|--------------|---------------|
| `ADMIN`      | `danger`      |
| `SUPERVISOR` | `warning`     |
| `DISPATCHER` | `info`        |
| `AGENT`      | `neutral`     |

Modo colapsado: exibe apenas o `Avatar`.

---

### Form Dialogs de Domínio

Cada domínio tem seus próprios dialogs de formulário seguindo o mesmo padrão:

| Arquivo                        | Domínio    | Usa Modal? | Mutations                          |
|--------------------------------|------------|------------|------------------------------------|
| `CargoFormDialog.tsx`          | Cargos     | Sim        | `useCreateCargo`, `useUpdateCargo` |
| `LotacaoFormDialog.tsx`        | Lotações   | —          | `useCreateLotacao`, `useUpdateLotacao` |
| `DepartmentFormDialog.tsx`     | Departments| —          | `useCreateDepartment`              |
| `ServidorFormDialog.tsx`       | Servidores | Não (custom)| `useCreateServidor`, `useUpdateServidor` |
| `MotoristaFormDialog.tsx`      | Motoristas | —          | `useCreateMotorista`, `useUpdateMotorista` |
| `VeiculoFormDialog.tsx`        | Veículos   | —          | `useCreateVeiculo`, `useUpdateVeiculo` |
| `UserFormDialog.tsx`           | Usuários   | —          | `useCreateUser`, `useUpdateUser`   |
| `RunOverrideDialog.tsx`        | Runs       | —          | `useOverrideRunMutation`           |

**Padrão de form dialog:**
- Modo `"create"` ou `"edit"` via prop `mode`
- Campos pré-populados no modo edit via prop `cargo/servidor/etc`
- Validação inline com mensagens de erro nos campos
- Tratamento de erros HTTP: 409 (duplicado) → erro inline no campo nome
- Fecha automaticamente no `onSuccess` da mutation
- Todos os textos via i18n do namespace do domínio

**Padrão de delete/desativar dialog:**

| Arquivo                        | Ação                    |
|--------------------------------|-------------------------|
| `CargoDeleteDialog.tsx`        | Desativar cargo         |
| `LotacaoDeleteDialog.tsx`      | Desativar lotação       |
| `ServidorDeleteDialog.tsx`     | Deletar servidor        |
| `MotoristaDesativarDialog.tsx` | Desativar motorista     |
| `MotoristaStatusDialog.tsx`    | Alterar status motorista|
| `VeiculoDesativarDialog.tsx`   | Desativar veículo       |

**View Modals (somente leitura):**

| Arquivo                  | Domínio    |
|--------------------------|------------|
| `CargoViewModal.tsx`     | Cargos     |
| `LotacaoViewModal.tsx`   | Lotações   |
| `ServidorViewModal.tsx`  | Servidores |


---

## Organisms (`src/components/organisms/`)

Seções de feature completas. Podem usar hooks, acessar server state via TanStack Query e renderizar múltiplas molecules e atoms. São os componentes de mais alto nível antes das páginas.

### AdminShell

**Arquivo:** `src/components/organisms/AdminShell.tsx`

Layout raiz do painel admin. Gerencia o estado de colapso da sidebar e persiste em cookie (`sidebar_collapsed`).

**Estrutura:**
```
div.flex.h-screen (bg-neutral-50)
├── SidebarNav (w-60 ou w-16 colapsado)
└── div.flex-1
    ├── header.h-14 (border-b bg-white)
    │   ├── h1 "GovMobile Admin"
    │   └── LanguageSwitcher
    └── main#main-content.flex-1.overflow-y-auto.p-6
        └── {children}
```

Lê `user` do `useAuthStore`. Usa `useLogout` para o botão de logout.

---

### SidebarNav

**Arquivo:** `src/components/organisms/SidebarNav.tsx`

Sidebar de navegação com collapse animado (`transition-[width] duration-200`).

**Estrutura:**
```
aside (w-60 ou w-16, border-r bg-white)
├── Logo/brand (h-14, border-b)
│   ├── Ícone "G" (bg-brand-primary, rounded-md)
│   └── "GovMobile" (visível apenas expandido)
├── nav (flex-1, overflow-y-auto)
│   └── ul > li > <Can> > <NavItem>
├── UserMenu (border-t)
└── Botão collapse (border-t, ChevronLeft/ChevronRight)
```

Cada item de nav é envolvido em `<Can perform={item.permission}>` quando tem permissão definida.

Ícones mapeados por nome string → componente Lucide via `ICON_MAP`:
`ClipboardList`, `Briefcase`, `MapPin`, `UserCheck`, `Car`, `Truck`, `Users`, `Building2`, `ScrollText`

---

### AuthGuard

**Arquivo:** `src/components/organisms/AuthGuard.tsx`

Wrapper de verificação de sessão para todas as rotas admin.

**Estados renderizados:**

| Estado                    | UI                                                    |
|---------------------------|-------------------------------------------------------|
| `isLoading`               | Skeleton animado (3 barras `animate-pulse`)           |
| `isError` + 401           | Redirect para `/login?reason=session_expired`         |
| `isError` + NETWORK_ERROR | `<ErrorState>` com retry                              |
| `isError` genérico        | `<ErrorState>` com retry                              |
| `user` presente           | `<PermissionsProvider role={...}>{children}`          |
| Sem user, sem erro        | Skeleton (aguardando query estabilizar)               |

Skeleton: `h-screen bg-neutral-50` centralizado com `flex flex-col items-center gap-4`.

---

### PageClient Organisms

Cada domínio tem um organism `*PageClient` que é o componente principal da página. Todos seguem o mesmo padrão:

**Padrão de PageClient:**

```
<Can perform={Permission.DOMINIO_VIEW} fallback={<AccessDenied />}>
  <div className="space-y-4">
    {/* Header com título + botão criar (gated por Can) */}
    <div className="flex items-center justify-between">
      <h1>{t("page.title")}</h1>
      <Can perform={Permission.DOMINIO_CREATE}>
        <Button onClick={handleOpenCreate}>{t("actions.create")}</Button>
      </Can>
    </div>

    {/* Toolbar: busca + filtros de status */}
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <input type="search" ... />  {/* busca por nome */}
      <div role="group">           {/* filtros: all / active / inactive */}
        <button aria-pressed={filter === "all"}>...</button>
      </div>
    </div>

    {/* Conteúdo condicional */}
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

**Organismos PageClient existentes:**

| Arquivo                      | Rota                    | Permissão base         |
|------------------------------|-------------------------|------------------------|
| `CargosPageClient.tsx`       | `/cargos`               | `CARGO_VIEW`           |
| `LotacoesPageClient.tsx`     | `/lotacoes`             | `LOTACAO_VIEW`         |
| `DepartmentsPageClient.tsx`  | `/departments`          | `DEPARTMENT_VIEW`      |
| `ServidoresPageClient.tsx`   | `/servidores`           | `SERVIDOR_VIEW`        |
| `MotoristasPageClient.tsx`   | `/frota/motoristas`     | `MOTORISTA_VIEW`       |
| `VeiculosPageClient.tsx`     | `/frota/veiculos`       | `VEICULO_VIEW`         |
| `UsersPageClient.tsx`        | `/users`                | `USER_VIEW`            |
| `RunsPageClient.tsx`         | `/runs`                 | `VIEW_RUNS`            |
| `AuditPageClient.tsx`        | `/audit`                | `AUDIT_VIEW`           |

---

### LoginForm e RegisterForm

**Arquivos:** `src/components/organisms/LoginForm.tsx`, `RegisterForm.tsx`

Formulários de autenticação auto-contidos. Usam `Input` e `Button` atoms. Fazem validação client-side antes de chamar a mutation.

`LoginForm` features:
- Máscara de CPF via `formatCpf()` / `unformatCpf()`
- Validação de formato CPF
- Mensagem de sessão expirada via `?reason=session_expired`
- Mapeamento de erros HTTP para mensagens i18n (401, 429, 500, NETWORK_ERROR)

---

## Componentes de Autorização (`src/components/auth/`)

### Can

**Arquivo:** `src/components/auth/Can.tsx`

Gate de renderização baseado em permissão. Usa `usePermissions()` internamente.

```tsx
<Can perform={Permission.CARGO_CREATE}>
  <Button>Criar Cargo</Button>
</Can>

<Can perform={Permission.USER_VIEW} fallback={<AccessDenied />}>
  <UsersTable />
</Can>
```

### PermissionsProvider

**Arquivo:** `src/components/auth/PermissionsProvider.tsx`

Injeta o role do usuário no contexto de permissões. Renderizado pelo `AuthGuard` após autenticação bem-sucedida.

```tsx
<PermissionsProvider role={UserRole.SUPERVISOR}>
  {children}
</PermissionsProvider>
```

---

## Padrões Visuais Recorrentes

### Tabelas de dados

Todas as tabelas seguem o mesmo padrão visual:

```
div.overflow-hidden.rounded-xl.border.border-neutral-200.bg-white.shadow-sm
└── table.w-full.text-sm
    ├── thead.bg-neutral-50.text-xs.font-medium.uppercase.text-neutral-500
    └── tbody.divide-y.divide-neutral-100.bg-white
        └── tr.transition-colors.hover:bg-neutral-50
```

Botões de ação nas linhas: ícones SVG inline (não Lucide) com `rounded-md p-1.5` e hover colorido por ação:
- Ver: `hover:bg-neutral-100 hover:text-neutral-700`
- Editar: `hover:bg-brand-primary/10 hover:text-brand-primary`
- Deletar/Desativar: `hover:bg-danger/10 hover:text-danger`
- Reativar: `hover:bg-success/10 hover:text-success`

### Skeleton Loading

Padrão de loading com `animate-pulse`:

```tsx
<div className="h-10 w-full animate-pulse rounded-md bg-neutral-200" />
<div className="h-12 w-full animate-pulse rounded-md bg-neutral-200" />
```

### Empty State

```tsx
<section className="rounded-md border border-neutral-200 bg-neutral-50 p-6">
  <h2 className="text-base font-semibold text-neutral-900">{t("page.empty.title")}</h2>
  <p className="mt-1 text-sm text-neutral-700">{t("page.empty.message")}</p>
</section>
```

### Access Denied

```tsx
<section className="rounded-md border border-danger/30 bg-danger/10 p-4">
  <p className="text-sm font-medium text-danger">{t("page.accessDenied")}</p>
</section>
```

### Toolbar de filtros

```tsx
<div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row">
  {/* Search input com ícone Lucide Search */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
    <input className="h-9 rounded-lg border border-neutral-200 bg-neutral-50 pl-9 ..." />
  </div>

  {/* Filtros pill */}
  <div role="group">
    <button aria-pressed={filter === "all"}
      className="rounded-full px-3 py-1 text-xs font-medium
        aria-pressed:bg-brand-primary aria-pressed:text-white
        default:bg-neutral-100 default:text-neutral-600">
      Todos
    </button>
  </div>
</div>
```

### Focus Ring padrão

Todos os elementos interativos usam:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1
```

Botões destrutivos usam `focus-visible:ring-danger`.

---

## Regras de Estilo (Obrigatórias)

| Regra                                                    | Status      |
|----------------------------------------------------------|-------------|
| Usar apenas Tailwind utility classes                     | Obrigatório |
| Usar tokens de design para cores, radius e fontes        | Obrigatório |
| Nenhum valor de cor hardcoded                            | Proibido    |
| Nenhum `style` inline (exceto valores dinâmicos com comentário) | Proibido |
| Nenhum CSS Module para estilização de componentes        | Proibido    |
| Todos os textos visíveis via `useTranslation()`          | Obrigatório |
| Nenhum check de role hardcoded (`user.role === "ADMIN"`) | Proibido    |
| Todo componente exportado com `data-testid` prop         | Obrigatório |
| Todo componente exportado com JSDoc                      | Obrigatório |
| Todo componente exportado com interface de props explícita | Obrigatório |

---

## Notificações Toast

Gerenciadas pela biblioteca **Sonner** (`^2.0.7`). Configurado no root layout:

```tsx
<Toaster position="bottom-right" richColors />
```

Uso nos hooks de mutation:

```typescript
import { toast } from "sonner";

toast.success(t("toast.created"));
toast.error(t("toast.error"));
```

---

## Ícones

Biblioteca: **Lucide React** (`^1.8.0`). Todos os ícones são SVG inline com `aria-hidden="true"`.

Ícones usados na navegação (mapeados por string em `SidebarNav`):

| Nome           | Rota            |
|----------------|-----------------|
| `ClipboardList`| /runs           |
| `Briefcase`    | /cargos         |
| `MapPin`       | /lotacoes       |
| `UserCheck`    | /servidores     |
| `Truck`        | /frota/motoristas|
| `Car`          | /frota/veiculos |
| `Users`        | /users          |
| `Building2`    | /departments    |
| `ScrollText`   | /audit          |

Ícones de ação nas tabelas são SVGs inline (não Lucide) para evitar bundle desnecessário em componentes de linha.

Ícones de UI geral: `X` (fechar modal), `Search` (toolbar), `ChevronLeft/Right` (sidebar toggle).
