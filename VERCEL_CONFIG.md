# Configuração da API na Vercel

## Situação Atual

O frontend está configurado para fazer requisições diretamente para o IP do backend:
- **URL da API**: `http://172.19.2.123:8000/api`

## ⚠️ Aviso sobre Mixed Content

Quando o frontend está em HTTPS (Vercel) e faz requisições para HTTP (backend), os navegadores bloqueiam por segurança (Mixed Content).

### Soluções Possíveis:

#### 1. **Configurar Variável de Ambiente na Vercel (Recomendado)**

1. Acesse o painel da Vercel
2. Vá em Settings → Environment Variables
3. Adicione:
   - `VITE_API_BASE_URL` = `http://172.19.2.123:8000/api`
   - `VITE_API_URL` = `http://172.19.2.123:8000/api`

**Nota**: Isso ainda pode causar Mixed Content, mas permite flexibilidade.

#### 2. **Usar HTTPS no Backend (Melhor Solução)**

Se o backend suportar HTTPS:
- Configure um certificado SSL no servidor `172.19.2.123:8000`
- Use `https://172.19.2.123:8000/api` nas variáveis de ambiente

#### 3. **Usar um Proxy Reverso (Alternativa)**

Configure um proxy reverso (nginx, Caddy, etc.) com HTTPS que faz proxy para o backend HTTP.

#### 4. **Desabilitar Mixed Content (Apenas para Testes)**

⚠️ **NÃO RECOMENDADO PARA PRODUÇÃO**

Os usuários precisariam desabilitar a proteção de Mixed Content no navegador, o que não é prático.

## Configuração Atual

O código está configurado para:
- **Desenvolvimento**: Usa `http://172.19.2.123:8000/api` diretamente
- **Produção**: Usa `http://172.19.2.123:8000/api` diretamente (ou variável de ambiente se configurada)

## Próximos Passos

1. Configure as variáveis de ambiente na Vercel (opcional, mas recomendado)
2. Faça o deploy
3. Teste o login
4. Se houver erro de Mixed Content, considere uma das soluções acima


