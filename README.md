# VAMU - Painel Administrativo

Painel web administrativo de visualização para aplicativo de mobilidade/entregas (estilo Uber + entregas) construído com **React**, **TypeScript**, **Ant Design 5.0** e **Vite**.

## 🎯 Características

- ✅ **Design System VAMU** com paleta Light/Dark customizada
- ✅ **Layout responsivo** (Desktop, Tablet, Mobile)
- ✅ **Acessibilidade** (WCAG 4.5:1, navegação por teclado, ARIA labels)
- ✅ **Segurança** (escape de HTML, CSP ready, sem secrets no código)
- ✅ **Arquitetura preparada** para integração com qualquer backend
- ✅ **TypeScript** com tipagem completa
- ✅ **Componentes reutilizáveis** e bem estruturados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🚀 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── BadgeStatus/    # Badge de status
│   ├── KPIBox/         # Card de KPI
│   ├── DriverCard/     # Card de motorista
│   ├── EmptyState/     # Estado vazio
│   ├── LoadingSkeleton/# Skeleton de loading
│   └── ConfirmDialog/  # Diálogo de confirmação
├── layouts/            # Layouts da aplicação
│   ├── MainLayout/     # Layout principal
│   ├── Sidebar/        # Barra lateral
│   └── Topbar/         # Barra superior
├── pages/              # Páginas da aplicação
│   ├── Dashboard/      # Dashboard principal
│   ├── Rides/          # Gestão de corridas
│   ├── Orders/         # Gestão de entregas
│   ├── Drivers/        # Gestão de motoristas
│   ├── Financial/      # Relatórios financeiros
│   └── ...
├── services/           # Serviços de API
│   └── api.ts          # Cliente Axios configurado
├── themes/             # Configuração de temas
│   ├── vamu.ts         # Tokens VAMU (Light/Dark)
│   └── ThemeProvider.tsx # Provider de tema
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces e tipos
├── utils/              # Utilitários
│   ├── escape.ts       # Funções de escape (segurança)
│   └── validation.ts   # Validações
└── mocks/              # Dados mockados
    └── data.ts         # Dados de exemplo
```

## 🔌 Integração com Backend

### 1. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api.vamu.com.br
VITE_WS_URL=wss://api.vamu.com.br/ws
```

### 2. Endpoints Esperados

O cliente API está configurado em `src/services/api.ts` e espera os seguintes endpoints:

#### Dashboard
- `GET /api/dashboard/kpis` - Retorna KPIs do dashboard

**Resposta esperada:**
```json
{
  "data": {
    "totalRides": 1250,
    "activeDeliveries": 45,
    "todayRevenue": 12500.50,
    "acceptanceRate": 87.5,
    "ridesChange": 12.5,
    "deliveriesChange": -5.2,
    "revenueChange": 8.3,
    "acceptanceChange": 2.1
  }
}
```

#### Corridas
- `GET /api/rides` - Lista corridas (query params: `page`, `pageSize`, `status`, `sortBy`, `sortOrder`)
- `GET /api/rides/:id` - Detalhes de uma corrida
- `PUT /api/rides/:id/status` - Atualiza status de uma corrida

**Resposta esperada (lista):**
```json
{
  "data": [
    {
      "id": "ride-123",
      "rideNumber": "RIDE-001",
      "customer": {
        "id": "cust-1",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "11999887766"
      },
      "driver": {
        "id": "driver-1",
        "name": "Maria Santos",
        "email": "maria@vamu.com",
        "phone": "11987654321",
        "rating": 4.8,
        "status": "online"
      },
      "status": "in_progress",
      "origin": {
        "street": "Rua A",
        "number": "123",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310100",
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "destination": {
        "street": "Rua B",
        "number": "456",
        "neighborhood": "Bela Vista",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310100",
        "latitude": -23.5615,
        "longitude": -46.6563
      },
      "distance": 5.2,
      "duration": 15,
      "fare": 25.50,
      "createdAt": "2024-01-15T10:30:00Z",
      "startedAt": "2024-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1250,
    "totalPages": 125
  }
}
```

#### Entregas/Pedidos
- `GET /api/orders` - Lista pedidos (mesmos query params)
- `GET /api/orders/:id` - Detalhes de um pedido
- `POST /api/orders/:id/assign` - Atribui entregador a um pedido

#### Motoristas
- `GET /api/drivers` - Lista motoristas
- `GET /api/drivers/:id` - Detalhes de um motorista
- `PUT /api/drivers/:id/status` - Atualiza status de um motorista

#### Eventos
- `GET /api/events` - Feed de eventos do sistema

#### Financeiro
- `GET /api/financial/reports?period=2024-01` - Relatórios financeiros

### 3. Autenticação

O cliente API está configurado para usar JWT Bearer tokens:

1. Token deve ser armazenado em `localStorage` com a chave `vamu-auth-token`
2. Token é automaticamente adicionado no header `Authorization: Bearer <token>`
3. Em caso de erro 401, o usuário é redirecionado para `/login`

**Exemplo de implementação de login:**

```typescript
// Em um componente de login
const handleLogin = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  localStorage.setItem('vamu-auth-token', response.data.token);
  // Redirecionar para dashboard
};
```

### 4. WebSocket (Tempo Real)

Para atualizações em tempo real (ex: status de corridas, localização de motoristas), implemente WebSocket:

```typescript
// Exemplo de conexão WebSocket
const ws = new WebSocket(import.meta.env.VITE_WS_URL);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'ride:status_changed':
      // Atualizar status da corrida
      break;
    case 'order:status_changed':
      // Atualizar status do pedido
      break;
    case 'driver:location_updated':
      // Atualizar localização do motorista
      break;
    case 'system:event':
      // Adicionar novo evento ao feed
      break;
  }
};
```

### 5. Substituindo Mocks por Chamadas Reais

Para substituir os dados mockados por chamadas reais à API:

1. **Dashboard** (`src/pages/Dashboard/Dashboard.tsx`):
   ```typescript
   // Substituir
   import { mockKPIs } from '@/mocks/data';
   
   // Por
   import { dashboardApi } from '@/services/api';
   
   // E usar
   const { data } = await dashboardApi.getKPIs();
   ```

2. **Corridas** (`src/pages/Rides/Rides.tsx`):
   ```typescript
   import { ridesApi } from '@/services/api';
   
   useEffect(() => {
     const loadRides = async () => {
       const response = await ridesApi.list({ page: 1, pageSize: 10 });
       setRides(response.data);
     };
     loadRides();
   }, []);
   ```

3. **Mesmo padrão para outras páginas**

### 6. Tratamento de Erros

O cliente API já trata erros comuns:
- **401**: Redireciona para login
- **403**: Exibe erro de permissão
- **404**: Recurso não encontrado
- **500**: Erro do servidor

Para tratamento customizado, use try/catch:

```typescript
try {
  const response = await ridesApi.list({ page: 1, pageSize: 10 });
  // Processar resposta
} catch (error) {
  // Tratar erro específico
  message.error('Erro ao carregar corridas');
}
```

## 🎨 Theming

### Paleta VAMU

O tema está configurado em `src/themes/vamu.ts` com tokens customizados para Light e Dark mode.

### Toggle de Tema

O toggle de tema está disponível no Topbar. O tema é persistido no `localStorage`.

### Customização de Tokens

Para customizar cores, edite `src/themes/vamu.ts`:

```typescript
export const vamuLightTokens = {
  colorPrimary: '#1E40AF', // Altere aqui
  // ...
};
```

## ♿ Acessibilidade

- ✅ Contraste mínimo WCAG 4.5:1
- ✅ Navegação por teclado
- ✅ ARIA labels em componentes interativos
- ✅ Foco visível
- ✅ Roles semânticos

## 🔒 Segurança

- ✅ Escape de HTML em todos os textos exibidos
- ✅ CSP ready (exemplo no `index.html`)
- ✅ Sem secrets/chaves no código
- ✅ Validação de inputs (estrutura pronta)
- ✅ Confirmações para ações perigosas

## 📱 Responsividade

- **Desktop**: Sidebar fixa, layout completo
- **Tablet**: Sidebar colapsável
- **Mobile**: Sidebar em drawer

## 🧪 Testes

Estrutura preparada para testes (não implementados neste projeto visual):

- **Unitários**: Jest + React Testing Library
- **E2E**: Cypress ou Playwright
- **Visual**: Storybook (stubs sugeridos)

## 📝 Próximos Passos

1. Implementar autenticação real
2. Conectar com backend real
3. Implementar WebSocket para tempo real
4. Adicionar testes
5. Configurar CI/CD
6. Adicionar mais funcionalidades conforme necessário

## 📄 Licença

Este projeto é um template de visualização. Adapte conforme necessário.

## 🤝 Suporte

Para dúvidas sobre integração, consulte os comentários em `src/services/api.ts` que documentam todos os pontos de integração esperados.

