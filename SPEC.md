# Especificação Técnica - VAMU Painel Administrativo

## 📋 Visão Geral

Painel web administrativo de **visualização** (não funcional) para aplicativo de mobilidade/entregas, construído com foco em:
- ✅ Segurança
- ✅ Fácil manutenção
- ✅ Fácil integração com qualquer backend

## 🛠️ Stack Tecnológica

- **React 18.2** - Framework UI
- **TypeScript 5.2** - Tipagem estática
- **Ant Design 5.12** - Componentes UI
- **Vite 5.0** - Build tool
- **React Router 6.21** - Roteamento
- **Axios 1.6** - Cliente HTTP
- **Day.js 1.11** - Manipulação de datas
- **Zustand 4.4** - Gerenciamento de estado (preparado, não usado nos mocks)

## 🎨 Design System

### Paleta VAMU

**Modo Light:**
- Primary: `#1E40AF` (Azul corporativo)
- Secondary: `#059669` (Verde para entregas)
- Accent: `#F59E0B` (Amarelo/laranja para alertas)
- Background: `#FFFFFF` / `#F9FAFB`
- Text: `#111827` / `#6B7280`

**Modo Dark:**
- Primary: `#60A5FA` (Azul claro)
- Secondary: `#34D399` (Verde claro)
- Accent: `#FBBF24` (Amarelo claro)
- Background: `#111827` / `#1F2937`
- Text: `#F9FAFB` / `#D1D5DB`

**Contraste:** Mínimo WCAG 4.5:1 garantido

### Tokens Ant Design

Tokens customizados aplicados via `ConfigProvider`:
- Cores primárias, secundárias, de status
- Backgrounds, textos, bordas
- Border radius, spacing, shadows
- Font family e sizes

## 📁 Arquitetura

### Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── BadgeStatus/
│   ├── KPIBox/
│   ├── DriverCard/
│   ├── EmptyState/
│   ├── LoadingSkeleton/
│   └── ConfirmDialog/
├── layouts/          # Layouts da aplicação
│   ├── MainLayout/
│   ├── Sidebar/
│   └── Topbar/
├── pages/            # Páginas/rotas
│   ├── Dashboard/
│   ├── Rides/
│   ├── Orders/
│   ├── Drivers/
│   ├── Financial/
│   └── ...
├── services/         # Serviços de API
│   └── api.ts        # Cliente Axios configurado
├── themes/           # Configuração de temas
│   ├── vamu.ts       # Tokens VAMU
│   └── ThemeProvider.tsx
├── types/            # Tipos TypeScript
│   └── index.ts
├── utils/            # Utilitários
│   ├── escape.ts     # Segurança (XSS)
│   └── validation.ts # Validações
└── mocks/            # Dados mockados
    └── data.ts
```

### Padrões de Código

1. **Container/Presenter Pattern**: Separação de lógica e apresentação
2. **Hooks customizados**: Preparados para extrair lógica (ex: `useDashboard`, `useDrivers`)
3. **TypeScript strict**: Tipagem completa em todos os componentes
4. **Componentes funcionais**: Hooks do React
5. **Composição**: Componentes pequenos e reutilizáveis

## 🔒 Segurança

### Implementado

1. **Escape de HTML**: Função `escapeHtml()` aplicada em todos os textos exibidos
2. **CSP Ready**: Meta tag CSP documentada no `index.html`
3. **Sem secrets**: Nenhuma chave/segredo embutido no código
4. **Variáveis de ambiente**: Uso de `import.meta.env.VITE_*`
5. **Validação visual**: Estrutura pronta para validadores (Yup/Zod)

### Recomendações para Produção

1. Implementar autenticação real (JWT)
2. Refresh token automático
3. Rate limiting no cliente
4. Sanitização de inputs
5. HTTPS obrigatório
6. Headers de segurança (HSTS, X-Frame-Options, etc.)

## ♿ Acessibilidade

### Implementado

1. **ARIA labels**: Em todos os componentes interativos
2. **Roles semânticos**: HTML semântico
3. **Navegação por teclado**: Suportada
4. **Foco visível**: Estilos de foco customizados
5. **Contraste**: WCAG 4.5:1 mínimo
6. **Tamanhos de toque**: Mínimo 44x44px

### Melhorias Futuras

1. Screen reader testing
2. Navegação por teclado completa
3. Skip links
4. Anúncios de mudanças dinâmicas (aria-live)

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações

- **Mobile**: Sidebar em drawer, tabelas em listas compactas
- **Tablet**: Sidebar colapsável
- **Desktop**: Layout completo

## 🔌 Integração Backend

### Cliente API

Localizado em `src/services/api.ts`:

- **Base URL**: Configurável via `VITE_API_URL`
- **Interceptors**: Request (token) e Response (erros)
- **Tipagem**: Respostas tipadas com `ApiResponse<T>`
- **Pagination**: Suporte a paginação padrão

### Endpoints Esperados

Documentados em `src/services/api.ts` com:
- URLs completas
- Métodos HTTP
- Query params
- Contratos JSON de exemplo
- Eventos WebSocket

### Substituição de Mocks

1. Importar funções de API de `@/services/api`
2. Substituir imports de `@/mocks/data`
3. Usar `useEffect` para carregar dados
4. Adicionar estados de loading/error

## 🧪 Testabilidade

### Estrutura Preparada

- Componentes isolados e testáveis
- Props tipadas
- Funções puras em utils
- Mocks separados

### Recomendações

1. **Unitários**: Jest + React Testing Library
2. **E2E**: Cypress ou Playwright
3. **Visual**: Storybook
4. **Snapshots**: Para componentes estáticos

## 📦 Build e Deploy

### Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview do build
npm run lint     # Linter
```

### Variáveis de Ambiente

Criar `.env` baseado em `.env.example`:

```env
VITE_API_URL=https://api.vamu.com.br
VITE_WS_URL=wss://api.vamu.com.br/ws
```

### Build de Produção

1. `npm run build` gera `dist/`
2. Servir arquivos estáticos
3. Configurar CSP headers no servidor
4. Configurar redirects para SPA (todas rotas → `index.html`)

## 🚀 Performance

### Otimizações Implementadas

1. Code splitting por rota (React Router)
2. Lazy loading preparado
3. Imagens otimizadas (placeholders)
4. CSS otimizado (Ant Design tree-shaking)

### Melhorias Futuras

1. Lazy loading de componentes pesados
2. Virtual scrolling em tabelas grandes
3. Memoização de componentes
4. Service Worker para cache
5. Bundle analysis

## 📝 Manutenção

### Boas Práticas

1. **Código limpo**: Nomes descritivos, funções pequenas
2. **Comentários**: Documentação em pontos críticos
3. **TypeScript**: Tipagem ajuda na manutenção
4. **Estrutura clara**: Fácil localizar código
5. **Componentes reutilizáveis**: DRY principle

### Extensibilidade

- Fácil adicionar novas páginas
- Fácil adicionar novos componentes
- Fácil adicionar novos endpoints
- Fácil customizar tema

## 🔄 Versionamento

- **v1.0.0**: Versão inicial (visual apenas)
- Próximas versões: Integração real, funcionalidades completas

## 📚 Documentação

- **README.md**: Guia de instalação e integração
- **PREVIEWS.md**: Descrição visual das telas
- **SPEC.md**: Este documento (especificação técnica)
- **Comentários no código**: Documentação inline

## ✅ Checklist de Entrega

- [x] Estrutura de projeto completa
- [x] Tema VAMU Light/Dark
- [x] Layout responsivo
- [x] Componentes reutilizáveis
- [x] Páginas principais
- [x] Mocks de dados
- [x] Tipos TypeScript
- [x] Cliente API configurado
- [x] Segurança (escape, CSP)
- [x] Acessibilidade (ARIA, contraste)
- [x] README completo
- [x] Documentação de integração

---

**Status:** ✅ Pronto para desenvolvimento front-end e integração com backend

