# Previews e Screenshots - VAMU Painel Administrativo

Este documento descreve as principais telas do painel administrativo e serve como referência visual para desenvolvimento e testes.

## 📸 Telas Principais

### 1. Dashboard (`/dashboard`)

**Descrição:** Tela principal com visão geral do sistema.

**Componentes:**
- 4 Cards de KPI (Total Corridas, Entregas Ativas, Receita Hoje, Taxa de Aceitação)
- Mapa placeholder com filtros de status
- Tabela de Corridas Recentes (5 últimas)
- Timeline/Feed de Eventos do sistema
- Tabela de Entregas Recentes (8 últimas)

**Funcionalidades visuais:**
- Cards de KPI com variação percentual
- Tabelas com sorting, filtering e paginação
- Timeline colorida por tipo de evento
- Clique em linha da tabela para ver detalhes (drawer)

**Screenshot placeholder:**
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                                              │
├─────────────────────────────────────────────────────────┤
│  [KPI] [KPI] [KPI] [KPI]                               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Mapa de Operações                              │   │
│  │  [Placeholder de Mapa]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ Corridas Recentes    │  │ Feed de Eventos      │   │
│  │ [Tabela]             │  │ [Timeline]           │   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Entregas Recentes                                │   │
│  │ [Tabela]                                         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 2. Corridas (`/rides`)

**Descrição:** Gestão completa de corridas.

**Componentes:**
- Tabela avançada com todas as corridas
- Colunas: Número, Cliente, Telefone, Motorista, Status, Origem, Destino, Distância, Valor, Data, Ações
- Drawer lateral para detalhes da corrida selecionada

**Funcionalidades visuais:**
- Filtros por status
- Sorting por qualquer coluna
- Paginação configurável
- Badges de status coloridos
- Formatação de valores monetários
- Formatação de datas

**Screenshot placeholder:**
```
┌─────────────────────────────────────────────────────────┐
│  Corridas                                               │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Tabela de Corridas]                            │   │
│  │                                                  │   │
│  │ Número | Cliente | Motorista | Status | ...     │   │
│  │ RIDE-1 | João    | Maria     | [Badge]| [Ver]  │   │
│  │ RIDE-2 | Ana     | Pedro     | [Badge]| [Ver]  │   │
│  │ ...                                              │   │
│  │                                                  │   │
│  │ [Pagination]                                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Detalhes da Corrida RIDE-001234          [X]    │   │
│  │                                                  │   │
│  │ Número: RIDE-001234                             │   │
│  │ Status: [Badge]                                 │   │
│  │ Cliente: João Silva                             │   │
│  │ Motorista: Maria Santos                         │   │
│  │ Origem: Rua A, 123                              │   │
│  │ Destino: Rua B, 456                             │   │
│  │ Distância: 5.2 km                               │   │
│  │ Valor: R$ 25,50                                 │   │
│  │ ...                                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Entregas (`/orders`)

**Descrição:** Gestão de pedidos/entregas.

**Componentes:**
- Tabela com todas as entregas
- Colunas: Número, Cliente, Telefone, Entregador, Status, Itens, Valor Total, Taxa, Tempo Estimado, Data, Ações
- Drawer lateral com detalhes completos (incluindo itens do pedido)

**Funcionalidades visuais:**
- Filtros por status
- Botão "Atribuir" para pedidos sem entregador
- Tabela de itens dentro do drawer
- Formatação de endereços completos

**Screenshot placeholder:**
```
┌─────────────────────────────────────────────────────────┐
│  Entregas                                               │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Tabela de Entregas]                            │   │
│  │                                                  │   │
│  │ Número  | Cliente | Status | Valor | Ações      │   │
│  │ PED-001 | Paulo   | [Badge]| R$ 98 | [Ver]      │   │
│  │ PED-002 | Mariana | [Badge]| R$ 47 | [Ver][Atribuir]│
│  │ ...                                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Motoristas (`/drivers`)

**Descrição:** Gestão de motoristas/entregadores.

**Componentes:**
- Grid de cards de motoristas
- Cada card mostra: Foto, Nome, Avaliação, Status, Telefone, Veículo
- Ações: Ligar, Mensagem
- Drawer lateral com perfil completo

**Funcionalidades visuais:**
- Cards responsivos (4 colunas desktop, 2 tablet, 1 mobile)
- Badges de status
- Rating visual com estrelas
- Informações do veículo

**Screenshot placeholder:**
```
┌─────────────────────────────────────────────────────────┐
│  Motoristas                                             │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ [Foto]   │ │ [Foto]   │ │ [Foto]   │ │ [Foto]   │  │
│  │ Maria    │ │ João     │ │ Ana      │ │ Carlos   │  │
│  │ ⭐ 4.8   │ │ ⭐ 4.9   │ │ ⭐ 4.7   │ │ ⭐ 4.6   │  │
│  │ [Online] │ │ [Busy]   │ │ [Online] │ │ [Offline]│  │
│  │ [Ligar]  │ │ [Ligar]  │ │ [Ligar]  │ │ [Ligar]  │  │
│  │ [Msg]    │ │ [Msg]    │ │ [Msg]    │ │ [Msg]    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ ...      │ │ ...      │ │ ...      │ │ ...      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 5. Financeiro (`/financial`)

**Descrição:** Relatórios e métricas financeiras.

**Componentes:**
- Cards de resumo (Receita Total, Despesas, Receita Líquida, Ticket Médio)
- Tabela de relatórios por período
- Totais calculados na tabela

**Funcionalidades visuais:**
- Formatação monetária
- Cores para valores positivos/negativos
- Tabela com sumário

**Screenshot placeholder:**
```
┌─────────────────────────────────────────────────────────┐
│  Financeiro                                             │
├─────────────────────────────────────────────────────────┤
│  [Receita Total] [Despesas] [Receita Líquida] [Ticket] │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Relatório de Entregas                           │   │
│  │                                                  │   │
│  │ Período | Receita | Despesas | Líquida | ...    │   │
│  │ 2024-01 | R$ 125k | R$ 45k   | R$ 80k  | ...    │   │
│  │ 2024-02 | R$ 138k | R$ 48k   | R$ 90k  | ...    │   │
│  │ ────────────────────────────────────────────────│   │
│  │ Total   | R$ 263k | R$ 93k   | R$ 170k | ...    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### 6. Relatórios (`/reports`)

**Status:** Em desenvolvimento

**Descrição:** Módulo de relatórios avançados (placeholder).

---

### 7. Configurações (`/settings`)

**Status:** Em desenvolvimento

**Descrição:** Configurações do sistema (placeholder).

---

### 8. Suporte (`/support`)

**Status:** Em desenvolvimento

**Descrição:** Central de suporte (placeholder).

---

## 🎨 Elementos Visuais Comuns

### Topbar
- Busca global (autocomplete)
- Seletor de empresa
- Notificações com badge
- Toggle de tema (Light/Dark)
- Menu do usuário

### Sidebar
- Logo VAMU
- Menu de navegação com ícones
- Colapsável
- Em mobile: transforma em drawer

### Componentes Reutilizáveis
- **BadgeStatus**: Badges coloridos por status
- **KPIBox**: Cards de métricas com variação
- **DriverCard**: Card de motorista
- **EmptyState**: Estado vazio
- **LoadingSkeleton**: Loading com skeleton

## 📱 Responsividade

- **Desktop (>1024px)**: Layout completo, sidebar fixa
- **Tablet (768px-1024px)**: Sidebar colapsável
- **Mobile (<768px)**: Sidebar em drawer, layout adaptado

## 🌓 Modo Dark/Light

Todas as telas suportam toggle entre modo claro e escuro, mantendo contraste WCAG 4.5:1.

## 🔍 Navegação

- Roteamento via React Router
- URLs semânticas (`/dashboard`, `/rides`, etc.)
- Navegação por teclado suportada
- Breadcrumbs (futuro)

---

**Nota:** Este documento serve como referência visual. Para screenshots reais, execute a aplicação e capture as telas em diferentes resoluções e modos (light/dark).

