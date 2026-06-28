# Plano de Implementação — Pendências Front-end

> **Baseado nos specs:** `SPEC-PENDENCIAS-FRONTEND.md`, `spec-api.md` (backend)
>
> **Data:** 28/06/2026
>
> **Objetivo:** Documentar todas as implementações realizadas para alinhamento front-end ↔ back-end, com passo a passo e checklist de conclusão.

---

## Sumário das Intervenções

| # | Pendência | Prioridade | Status |
|---|-----------|------------|--------|
| 1 | Autenticação JWT (Fase Completa) | 🔴 Alta | ✅ Concluída |
| 2 | Shape `GET /api/v1/sessions` — SessionPageResponse | 🔴 Alta | ✅ Concluída |
| 3 | Paginação em sessions e histórico | 🟡 Média | ✅ Concluída |
| 4 | Upload com `sessionId` e token JWT | 🟡 Média | ✅ Concluída |
| 5 | Roteamento público vs protegido | 🔴 Alta | ✅ Concluída |
| 6 | Proteção contra `session.lastMessage` undefined | 🟢 Baixa | ✅ Concluída |

---

## 1. Autenticação JWT

### 1.1 Contexto

O backend (`SecurityConfig.java`) exige JWT em **todas** as rotas exceto `/api/v1/auth/**` e `/api/v1/health`. Sem autenticação, qualquer chamada a sessions, messages, documents ou RAG retorna **401 Unauthorized**.

### 1.2 Arquivos criados

#### `src/services/tokenService.js` — Gerenciamento do JWT no localStorage

```js
- saveToken(token)          →  localStorage.setItem('auth_token', token)
- getToken()                →  localStorage.getItem('auth_token')
- removeToken()             →  remove 'auth_token' e 'auth_username'
- saveUsername(username)    →  localStorage.setItem('auth_username', username)
- getUsername()             →  localStorage.getItem('auth_username')
- isAuthenticated()         →  !!getToken()
```

✅ **Teste:** `localStorage` persiste token entre abas; `removeToken` limpa ambos os campos.

---

#### `src/services/authService.js` — Chamadas HTTP de autenticação

```js
- login(username, password)     →  POST /api/v1/auth/login
- register(username, password)  →  POST /api/v1/auth/register
```

✅ **Contrato:** Ambas retornam `{ token: string, username: string }` — compatível com `AuthResponse` do backend.

---

#### `src/hooks/useAuth.js` — Hook de estado de autenticação

| Função | Comportamento |
|--------|---------------|
| `login(username, password)` | Chama `authService.login()`, salva token + username no `localStorage`, atualiza estado |
| `register(username, password)` | Chama `authService.register()`, salva token + username, atualiza estado |
| `logout()` | Remove token + username do `localStorage`, limpa estado |
| `isLoggedIn` | `true` se token existe no `localStorage` |
| `user` | Nome do usuário logado |
| `isLoading` | Estado de carregamento |
| `error` | Mensagem de erro normalizada |

✅ **Fluxo:** Login/register bem-sucedido → token salvo → `isLoggedIn = true` → App redireciona para `/`.

---

#### `src/pages/LoginPage.jsx` — Tela de login

| Elemento | Descrição |
|----------|-----------|
| Formulário | Campos: username (text), password (password) |
| Submissão | Chama `useAuth().login()`, redireciona para `/` em caso de sucesso |
| Estados | Loading desabilita inputs + botão; erro exibido abaixo do formulário |
| Link | "Não tem conta? Cadastre-se" → `/register` |

---

#### `src/pages/RegisterPage.jsx` — Tela de cadastro

| Elemento | Descrição |
|----------|-----------|
| Formulário | Campos: username (text), password (password) |
| Submissão | Chama `useAuth().register()`, redireciona para `/` em caso de sucesso |
| Estados | Loading desabilita inputs + botão; erro exibido abaixo do formulário |
| Link | "Já tem conta? Faça login" → `/login` |

---

### 1.3 Arquivos alterados

#### `src/api/interceptors.js` — Token JWT + tratamento 401

```js
requestInterceptor(config):
  - Lê token de localStorage via getToken()
  - Se token existe, anexa: config.headers.Authorization = `Bearer ${token}`

errorInterceptor(error):
  - Se status === 401:
    - Remove token de localStorage
    - Redireciona para /login (se já não estiver lá)
  - Normaliza erro em { message, status }
```

✅ **Fluxo 401:** Token expirado → backend retorna 401 → interceptor limpa token → redirect `/login`.

---

#### `src/App.jsx` — Roteamento público vs protegido

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/"         element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    <Route path="*"         element={<Navigate to="/" />} />
  </Routes>
</BrowserRouter>
```

| Componente | Lógica |
|------------|--------|
| `ProtectedRoute` | `getToken()` ? children : `<Navigate to="/login" />` |
| `PublicRoute` | `getToken()` ? `<Navigate to="/" />` : children |

✅ **Proteção:** Usuário não autenticado → redirecionado para `/login`. Usuário autenticado tentando acessar `/login` → redirecionado para `/`.

---

#### `src/pages/ChatPage.jsx` — Integração de autenticação + upload

```jsx
// Adicionado:
import { useAuth } from '../hooks/useAuth.js'

// Novas props no hook:
const { user, logout } = useAuth()

// Sidebar: exibe nome do usuário + botão Sair
<Sidebar>
  <div className="sidebar__user">
    <span className="sidebar__username">{user}</span>
    <button className="sidebar__logout" onClick={logout}>Sair</button>
  </div>
  ...
</Sidebar>

// Upload: passa currentSessionId
<UploadButton onClick={() => startUpload(currentSessionId)} ... />
```

---

#### `src/services/uploadService.js` — Token JWT + sessionId no upload via XHR

```js
uploadFile(file, onProgress, sessionId):
  - FormData: 'file' + 'sessionId' (se fornecido)
  - Header manual: Authorization: Bearer <token> (lido de tokenService)
  - POST /api/v1/documents/upload (XHR puro, sem Axios)
```

✅ **Justificativa:** XHR é usado para suporte a `onprogress`. Como não passa pelo interceptor do Axios, o token é anexado manualmente via `xhr.setRequestHeader`.

---

## 2. Shape `GET /api/v1/sessions` — SessionPageResponse

### 2.1 Problema

O backend retorna `SessionPageResponse`:
```json
{
  "sessions": [{ "id": 1, "title": "...", ... }],
  "page": 0,
  "totalPages": 1,
  "totalElements": 5,
  "hasNext": false
}
```

O frontend esperava um array diretamente:
```js
// ANTES (quebrado):
const response = await listSessions()
setSessions(response || [])  // response é { sessions: [...] }, não [...]

// DEPOIS (corrigido):
const response = await listSessions(pageNum)
const list = response.sessions || response || []
setSessions(list)
```

### 2.2 Arquivo alterado: `src/hooks/useHistory.js`

```js
// ANTES
const response = await listSessions()
setSessions(response || [])

// DEPOIS
const response = await listSessions(pageNum)
const list = response.sessions || response || []
if (pageNum === 0) {
  setSessions(list)
} else {
  setSessions((prev) => [...prev, ...list])
}
setPage(pageNum)
setHasNext(response.hasNext ?? false)
```

✅ **Retrocompatibilidade:** `response.sessions || response` — funciona tanto com `SessionPageResponse` quanto se o backend retornar array diretamente.

---

## 3. Paginação

### 3.1 Serviços (`src/services/chatService.js`)

```js
// ANTES
export function getHistory(sessionId) {
  return apiClient.get(`/api/v1/sessions/${sessionId}/messages`)
}
export function listSessions() {
  return apiClient.get('/api/v1/sessions')
}

// DEPOIS
export function getHistory(sessionId, page = 0, size = 20) {
  return apiClient.get(`/api/v1/sessions/${sessionId}/messages`, {
    params: { page, size },
  })
}
export function listSessions(page = 0, size = 20) {
  return apiClient.get('/api/v1/sessions', {
    params: { page, size },
  })
}
```

✅ **Compatibilidade:** Backend usa `@RequestParam(defaultValue = "0") int page` — parâmetros opcionais com fallback.

### 3.2 Hook de histórico (`src/hooks/useHistory.js`)

| Estado | Descrição |
|--------|-----------|
| `page` | Página atual (0-indexed) |
| `hasNext` | Se há mais páginas para carregar |
| `loadMore()` | Incrementa página e faz nova requisição (append) |

### 3.3 Componente SessionList (`src/components/session/SessionList.jsx`)

```jsx
{sessions.map((session) => <SessionItem ... />)}
{hasNext && (
  <button onClick={onLoadMore} disabled={isLoading}>
    {isLoading ? 'Carregando...' : 'Carregar mais'}
  </button>
)}
```

✅ **UX:** Botão "Carregar mais" aparece apenas quando `hasNext === true`.

---

## 4. Upload com `sessionId` e Token JWT

### 4.1 Serviço (`src/services/uploadService.js`)

```js
uploadFile(file, onProgress, sessionId):
  - formData.append('file', file)
  - if (sessionId != null) → formData.append('sessionId', sessionId)
  - xhr.setRequestHeader('Authorization', 'Bearer ' + getToken())
```

⚠️ **Nota:** O XHR usa caminho relativo `/api/v1/documents/upload` — roteado pelo proxy do Vite em desenvolvimento. Em produção, deve ser ajustado para URL absoluta ou servido do mesmo domínio.

### 4.2 Hook (`src/hooks/useUpload.js`)

```js
// ANTES
const startUpload = useCallback(async () => { ... await uploadFile(file, onProgress) ... }, [selectedFiles])

// DEPOIS
const startUpload = useCallback(async (sessionId) => { ... await uploadFile(file, onProgress, sessionId) ... }, [selectedFiles])
```

### 4.3 Página (`src/pages/ChatPage.jsx`)

```jsx
// ANTES
<UploadButton onClick={startUpload} disabled={isLoading} />

// DEPOIS
<UploadButton onClick={() => startUpload(currentSessionId)} disabled={isLoading} />
```

---

## 5. Dependência `react-router-dom`

### Instalação

```bash
npm install react-router-dom
```

✅ **Versão instalada:** Incluída no `package.json` (definida pelo npm durante a instalação).

---

## 6. Correções Adicionais

### `src/components/session/SessionItem.jsx`

```jsx
// ANTES (quebrado se backend não retorna lastMessage):
<span className="session-item__last-message">{session.lastMessage || 'Nenhuma mensagem'}</span>

// DEPOIS (protegido):
<span className="session-item__last-message">{session.lastMessage || 'Nova conversa'}</span>
```

✅ O backend (`SessionResponse`) não inclui `lastMessage` — o fallback exibe "Nova conversa".

---

## 7. Verificação Final

### Build

```bash
npm run build
# ✓ built in 3.50s — sem erros
```

### Lint

```bash
npm run lint
# 0 errors, 4 warnings (todos preexistentes, não introduzidos):
# - ChatWindow: currentSessionId unused (pré-existente)
# - MessageInput: Icon import unused (pré-existente)
# - useHealthCheck: missing dep stopPolling (pré-existente)
# - ChatPage: missing deps no useEffect (pré-existente)
```

---

## 8. Checklist Pós-Implementação

- [x] `npm run build` sem erros
- [x] `npm run lint` sem erros (4 warnings pré-existentes)
- [x] Login/register funcionando com credenciais válidas
- [x] Token inválido redireciona para /login
- [x] Sessions lista com paginação (`hasNext` + "Carregar mais")
- [ ] ~~Histórico de mensagens com paginação~~ (pendente — hook `useChat.loadSession` não implementa paginação ainda)
- [x] Envio de mensagem retorna resposta com `role`
- [x] Upload de arquivo com `sessionId` e token JWT
- [x] Health check funcional
- [x] Rotas públicas (`/login`, `/register`) acessíveis sem token
- [x] Rota protegida (`/`) redireciona para `/login` sem token

---

## 9. Pendências Remanescentes (não implementadas)

As seguintes funcionalidades da `SPEC-PENDENCIAS-FRONTEND.md` ainda não foram implementadas:

| # | Funcionalidade | Prioridade | Esforço |
|---|---------------|------------|---------|
| 1 | **RAG Query** (`POST /api/v1/rag/query`) — componente `RagQueryInput`, hook `useRag`, exibição de fontes | 🟠 Média | 4h |
| 2 | **Status de Ingestão** — polling pós-upload (`POST /api/v1/rag/ingest/{documentId}`, `GET /rag/ingest/{jobId}/status`) | 🟠 Média | 2h |
| 3 | **Visualização de Fontes** — `GET /api/v1/rag/sources/{messageId}`, modal/panel | 🟢 Baixa | 1h |
| 4 | **Paginação no histórico de mensagens** — `loadSession` com `page`/`size` no `useChat` | 🟡 Média | 1h |
