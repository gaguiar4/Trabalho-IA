# Spec-Driven — Front-end (Plataforma Conversacional)

> **Baseado nos specs do back-end:** `spec-api.md`, `spec-dominio.md`, `spec-casos-de-uso.md`, `spec-arquitetura.md`, `implementacoes-pendentes.md`
>
> **Data:** 27/06/2026
>
> **Objetivo:** Mapear todas as pendências do front-end para integração coesa com o back-end, evitando conflitos de contrato.

---

## 1. Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.x | UI |
| Vite | 8.x | Build/Dev server |
| Axios | 1.18x | HTTP client |
| JavaScript (JSX) | — | Linguagem (sem TypeScript) |

---

## 2. Mapeamento Back-end → Front-end

### 2.1 O que já funciona (já conectado)

| Back-end | Front-end | Status |
|---|---|---|
| `POST /api/v1/sessions` | `chatService.createSession()` | ✅ Conectado |
| `GET /api/v1/sessions` | `chatService.listSessions()` | ✅ Conectado (sem paginação) |
| `POST /api/v1/sessions/{id}/messages` | `chatService.sendMessage()` | ✅ Conectado |
| `GET /api/v1/sessions/{id}/messages` | `chatService.getHistory()` | ✅ Conectado |
| `GET /api/v1/health` | `healthService.checkHealth()` | ✅ Conectado |
| `POST /api/v1/documents/upload` | `uploadService.uploadFile()` | ✅ Conectado |

### 2.2 O que precisa ser implementado/adaptado

| # | Funcionalidade | Back-end | Front-end | Prioridade |
|---|---|---|---|---|
| 1 | **Autenticação JWT** | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` | Tela de login/register, gerenciamento de token, rotas protegidas | 🔴 Alta |
| 2 | **Paginação nas sessions** | `GET /api/v1/sessions?page=0&size=20` (já implementado) | Adicionar paginação/scroll infinito no `SessionList` | 🟡 Média |
| 3 | **RAG Query** | `POST /api/v1/rag/query` | Interface de consulta RAG com exibição de fontes | 🟠 Média |
| 4 | **Ingestão de Documento** | `POST /api/v1/rag/ingest/{documentId}`, `GET /api/v1/rag/ingest/{jobId}/status` | Status de processamento pós-upload | 🟠 Média |
| 5 | **Visualização de Fontes** | `GET /api/v1/rag/sources/{messageId}` | Painel de fontes nas respostas RAG | 🟢 Baixa |
| 6 | **SessionHistoryResponse — role** | Back-end retorna `role` (USER/ASSISTANT) | Hook `useChat` mapeia `role` em vez de `sender` | ✅ Já implementado |

---

## 3. Contratos de API

### 3.1 Sessions

**`GET /api/v1/sessions?page=0&size=20`**

```json
{
  "sessions": [
    {
      "id": 1,
      "title": "Nova conversa",
      "status": "ACTIVE",
      "createdAt": "2026-06-27T10:00:00.000Z",
      "updatedAt": "2026-06-27T10:30:00.000Z"
    }
  ],
  "page": 0,
  "totalPages": 1,
  "totalElements": 5,
  "hasNext": false
}
```

**`POST /api/v1/sessions`** — Response `201`

```json
{
  "id": 1,
  "title": "Nova conversa",
  "status": "ACTIVE",
  "createdAt": "2026-06-27T10:00:00.000Z",
  "updatedAt": "2026-06-27T10:00:00.000Z"
}
```

### 3.2 Messages

**`POST /api/v1/sessions/{id}/messages`**

```json
// Request
{ "content": "Olá, qual é a capital do Brasil?" }

// Response 201
{
  "id": 10,
  "sessionId": 1,
  "content": "A capital do Brasil é Brasília.",
  "role": "ASSISTANT",
  "status": "RECEIVED",
  "createdAt": "2026-06-27T10:31:00.000Z",
  "updatedAt": "2026-06-27T10:31:00.000Z"
}
```

**`GET /api/v1/sessions/{id}/messages?page=0&size=20`**

```json
{
  "sessionId": 1,
  "messages": [
    {
      "id": 9,
      "sessionId": 1,
      "content": "Olá, qual é a capital do Brasil?",
      "role": "USER",
      "status": "SENT",
      "createdAt": "2026-06-27T10:30:00.000Z",
      "updatedAt": "2026-06-27T10:30:00.000Z"
    },
    {
      "id": 10,
      "sessionId": 1,
      "content": "A capital do Brasil é Brasília.",
      "role": "ASSISTANT",
      "status": "RECEIVED",
      "createdAt": "2026-06-27T10:31:00.000Z",
      "updatedAt": "2026-06-27T10:31:00.000Z"
    }
  ],
  "page": 0,
  "totalPages": 1,
  "totalElements": 2,
  "hasNext": false
}
```

### 3.3 Auth

**`POST /api/v1/auth/register`**

```json
// Request
{ "username": "user@email.com", "password": "SenhaForte123" }

// Response 201
{ "token": "eyJhbGciOiJIUzI1NiIs...", "username": "user@email.com" }
```

**`POST /api/v1/auth/login`**

```json
// Request
{ "username": "user@email.com", "password": "SenhaForte123" }

// Response 200
{ "token": "eyJhbGciOiJIUzI1NiIs...", "username": "user@email.com" }
```

### 3.4 RAG

**`POST /api/v1/rag/query`**

```json
// Request
{ "query": "O que diz o documento sobre política?", "sessionId": 1 }

// Response 200
{
  "answer": "O documento afirma que...",
  "sources": [
    {
      "documentId": 5,
      "documentName": "relatorio.pdf",
      "excerpt": "trecho relevante do documento...",
      "relevanceScore": 0.92
    }
  ]
}
```

**`POST /api/v1/rag/ingest/{documentId}`** — Response `202`

```json
{
  "jobId": 1,
  "documentId": 5,
  "status": "QUEUED",
  "chunksCount": 0,
  "errorMessage": null
}
```

**`GET /api/v1/rag/ingest/{jobId}/status`** — Response `200`

```json
{
  "jobId": 1,
  "documentId": 5,
  "status": "READY",
  "chunksCount": 42,
  "errorMessage": null
}
```

**`GET /api/v1/rag/sources/{messageId}`** — Response `200`

```json
[
  {
    "documentId": 5,
    "documentName": "relatorio.pdf",
    "excerpt": "trecho relevante do documento...",
    "relevanceScore": 0.92
  }
]
```

### 3.5 Documents

**`POST /api/v1/documents/upload`** — Multipart Form Data

```json
// Response 201
{
  "id": 5,
  "sessionId": 1,
  "fileName": "uuid-relatorio.pdf",
  "originalName": "relatorio.pdf",
  "type": "PDF",
  "size": 2048576,
  "storagePath": "./uploads/uuid-relatorio.pdf",
  "uploadedAt": "2026-06-27T11:00:00.000Z"
}
```

**`GET /api/v1/documents/{documentId}`** — Response `200`

```json
{
  "id": 5,
  "sessionId": 1,
  "fileName": "uuid-relatorio.pdf",
  "originalName": "relatorio.pdf",
  "type": "PDF",
  "size": 2048576,
  "storagePath": "./uploads/uuid-relatorio.pdf",
  "uploadedAt": "2026-06-27T11:00:00.000Z"
}
```

### 3.6 Health

**`GET /api/v1/health`** — Response `200`

```json
{
  "status": "UP",
  "database": "UP",
  "timestamp": "2026-06-27T11:00:00.000Z",
  "version": "0.0.1-SNAPSHOT"
}
```

---

## 4. Modelos de Dados (Front-end)

> Atualmente o front-end usa JS puro. Abaixo estão os shapes esperados pela API.
> Recomenda-se criar um arquivo `src/utils/types.js` com estes shapes documentados.

### Session

```js
{
  id: number,
  title: string,
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED',
  createdAt: string,       // ISO 8601
  updatedAt: string
}
```

### SessionPageResponse

```js
{
  sessions: Session[],
  page: number,
  totalPages: number,
  totalElements: number,
  hasNext: boolean
}
```

### Message

```js
{
  id: number,
  sessionId: number,
  content: string,
  role: 'USER' | 'ASSISTANT' | 'SYSTEM',
  status: 'SENT' | 'RECEIVED' | 'FAILED',
  createdAt: string,          // ISO 8601
  updatedAt: string           // ISO 8601
}
```

### MessageHistory

```js
{
  sessionId: number,
  messages: Message[],
  page: number,
  totalPages: number,
  totalElements: number,
  hasNext: boolean
}
```

### AuthResponse

```js
{
  token: string,
  username: string
}
```

### RagQueryResponse

```js
{
  answer: string,
  sources: SourceDetail[]
}
```

### SourceDetail

```js
{
  documentId: number,
  documentName: string,
  excerpt: string,
  relevanceScore: number
}
```

### IngestionStatus

```js
{
  jobId: number,
  documentId: number,
  status: 'QUEUED' | 'PARSING' | 'CHUNKING' | 'EMBEDDING' | 'READY' | 'FAILED',
  chunksCount: number,
  errorMessage: string | null
}
```

### DocumentResponse

```js
{
  id: number,
  sessionId: number | null,
  fileName: string,
  originalName: string,
  type: 'PDF' | 'TXT',
  size: number,
  storagePath: string,
  uploadedAt: string
}
```

---

## 5. Plano de Implementação

### Fase 1 — Mapeamento `role` → `sender` ✅ (já implementado)

**Arquivo:** `src/hooks/useChat.js` (linha 64)

O mapeamento já está funcionando corretamente:

```js
sender: msg.role?.toLowerCase() === 'assistant' ? 'assistant' : 'user',
```

A API retorna `role: "USER" | "ASSISTANT"` e o hook converte para `sender: "user" | "assistant"`. Nenhuma ação necessária.

---

### Fase 2 — Paginação no histórico e lista de sessões

**Arquivos envolvidos:**
- `src/services/chatService.js`
- `src/hooks/useChat.js`
- `src/hooks/useHistory.js`
- `src/components/session/SessionList.jsx`

**Alterações:**
1. `chatService.listSessions(page, size)` — adicionar parâmetros `?page=0&size=20`
2. `chatService.getHistory(sessionId, page, size)` — adicionar parâmetros de paginação
3. `useHistory` — controlar `page` atual, chamar `fetchSessions(page, size)`
4. `SessionList` — suportar scroll infinito ou botão "Carregar mais" usando `hasNext`

---

### Fase 3 — Autenticação JWT

**Novos arquivos:**

| Arquivo | Função |
|---|---|
| `src/pages/LoginPage.jsx` | Tela de login com formulário username + password |
| `src/pages/RegisterPage.jsx` | Tela de cadastro com formulário username + password |
| `src/hooks/useAuth.js` | Hook: login, register, logout, token, usuário atual |
| `src/services/authService.js` | Chamadas HTTP: `authService.login()`, `authService.register()` |
| `src/services/tokenService.js` | Gerenciamento do JWT no `localStorage` |

**Arquivos alterados:**

| Arquivo | Alteração |
|---|---|
| `src/api/interceptors.js` | Adicionar `requestInterceptor` que anexa `Authorization: Bearer <token>` |
| `src/api/client.js` | Se `tokenService` tiver token, já iniciar com header |
| `src/App.jsx` | Adicionar roteamento: público (login/register) vs protegido (chat) |
| `package.json` | Adicionar dependência `react-router-dom` |

**Fluxo de autenticação:**

```
Usuário não autenticado → LoginPage ou RegisterPage
  → authService.login(credentials) → recebe AuthResponse { token, username }
  → tokenService.saveToken(token)   → localStorage
  → interceptor.request anexa "Authorization: Bearer <token>"
  → App redireciona para ChatPage
```

**Fluxo de renovação/expiracão:**

```
Interceptor.response → erro 401
  → tokenService.removeToken()
  → redirecionar para LoginPage
```

---

### Fase 4 — RAG Query

**Novos arquivos:**

| Arquivo | Descrição |
|---|---|
| `src/services/ragService.js` | `ragQuery(query, sessionId)`, `getIngestionStatus(jobId)`, `getSources(messageId)` |
| `src/hooks/useRag.js` | Estados: query, answer, sources, isLoading, error |
| `src/components/rag/RagQueryInput.jsx` | Input para consulta RAG |
| `src/components/rag/RagSourcesPanel.jsx` | Painel exibindo fontes da resposta |
| `src/components/rag/RagSourceItem.jsx` | Item individual de fonte |

**Alterações em componentes existentes:**

| Componente | Alteração |
|---|---|
| `ChatPage.jsx` | Adicionar toggle "Chat" / "RAG" ou detectar sessão com documentos |
| `MessageBubble.jsx` | Exibir botão "Ver fontes" quando resposta tiver sources |
| `useChat.js` | Suportar modo RAG integrado ao fluxo de mensagens |

**Fluxo RAG Query:**

```
Usuário digita pergunta → RagQueryInput
  → useRag.executeQuery(query, sessionId)
  → ragService.ragQuery(query, sessionId)
  → POST /api/v1/rag/query
  → Response: { answer, sources }
  → Exibir answer no chat + RagSourcesPanel com fontes
```

---

### Fase 5 — Status de Ingestão

**Arquivos alterados:**

| Arquivo | Alteração |
|---|---|
| `src/hooks/useUpload.js` | Após upload, chamar `ragService.ingestDocument(documentId)` e iniciar polling |
| `src/services/ragService.js` | Adicionar `ingestDocument(documentId)` |
| `src/components/upload/ProgressBar.jsx` | Exibir status do pipeline (QUEUED, PARSING, CHUNKING, EMBEDDING, READY, FAILED) |

**Fluxo de ingestão:**

```
Upload concluído → recebe DocumentResponse { id: 5 }
  → ragService.ingestDocument(5)
  → POST /api/v1/rag/ingest/5
  → Response: IngestionStatus { jobId: 1, status: "QUEUED" }
  → Iniciar polling a cada 2s:
    → GET /api/v1/rag/ingest/1/status
    → Atualizar ProgressBar com status atual
    → Quando status = "READY" ou "FAILED", parar polling
```

---

### Fase 6 — Visualização de Fontes

**Arquivos alterados:**

| Arquivo | Alteração |
|---|---|
| `src/components/chat/MessageBubble.jsx` | Adicionar botão "📎 Ver fontes" se `message.sources` existir |
| `src/components/rag/RagSourcesPanel.jsx` | Modal ou painel lateral listando `SourceDetail[]` |

**Fluxo:**

```
Usuário clica em "Ver fontes" em uma mensagem
  → GET /api/v1/rag/sources/{messageId}
  → Modal/Panel exibe: documento, trecho, relevância
```

---

## 6. Mapa de Dependências entre Camadas

```
Front-end
│
├── React Router                  ← NOVO
│
├── Axios
│   └── Interceptors
│       ├── requestInterceptor    ← ADAPTAR (anexar token JWT)
│       └── errorInterceptor      ← ADAPTAR (redirect 401 → login)
│
├── Services (src/services/)
│   ├── authService.js            ← NOVO
│   ├── chatService.js            ← ADAPTAR (paginação)
│   ├── ragService.js             ← NOVO
│   ├── uploadService.js          ← OK + ADAPTAR (disparar ingestão)
│   └── healthService.js          ← OK
│
├── Hooks (src/hooks/)
│   ├── useAuth.js                ← NOVO
│   ├── useChat.js                ← ADAPTAR (role mapping, paginação)
│   ├── useHistory.js             ← ADAPTAR (paginação)
│   ├── useRag.js                 ← NOVO
│   ├── useUpload.js              ← ADAPTAR (status de ingestão)
│   └── useHealthCheck.js         ← OK
│
├── Components (src/components/)
│   ├── auth/                     ← NOVO
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── rag/                      ← NOVO
│   │   ├── RagQueryInput.jsx
│   │   ├── RagSourcesPanel.jsx
│   │   └── RagSourceItem.jsx
│   ├── chat/                     ← ADAPTAR
│   │   └── MessageBubble.jsx     (fontes)
│   ├── session/                  ← ADAPTAR
│   │   └── SessionList.jsx       (paginação)
│   └── upload/                   ← ADAPTAR
│       └── ProgressBar.jsx       (status pipeline)
│
└── Pages (src/pages/)
    ├── LoginPage.jsx             ← NOVO
    ├── RegisterPage.jsx          ← NOVO
    └── ChatPage.jsx              ← ADAPTAR (proteção de rota, toggle RAG)
```

---

## 7. Convenções e Alinhamento com Back-end

| Regra | Front-end |
|---|---|
| Nomes em inglês | ✅ Já segue |
| DTOs | Criar `src/utils/types.js` com shapes documentados |
| Validação em 2 camadas | Front-end valida antes de enviar (tamanho, obrigatórios) |
| Tratamento de erros | Interceptor normaliza erros ✅ Já implementado |
| Paginação | Sempre enviar `page` e `size`; usar `hasNext` para controle |
| Upload via XHR | Manter para suporte a progresso ✅ Já implementado |
| Token JWT | Salvar em `localStorage`, anexar via interceptor, remover no logout |
| IDs | Back-end usa `Long` (number). Front-end preserva `number` ao carregar da API; `crypto.randomUUID()` usado apenas para mensagens locais temporárias |
| Timestamps | ISO 8601. Usar `new Date(isoString).toLocaleString('pt-BR')` |
| Roles | `USER` → `user`, `ASSISTANT` → `assistant` no mapeamento interno |

---

## 8. Cronograma Sugerido

| Fase | Tarefa | Esforço estimado | Depende de |
|---|---|---|---|
| 1 | Mapeamento `role` no `useChat.js` | ✅ Concluído | — |
| 2 | Paginação sessions + histórico | 2h | Fase 1 |
| 3 | Autenticação JWT (telas, hooks, service, token, rotas) | 6h | Fase 2 |
| 4 | RAG Query (componentes, hook, service) | 4h | Fase 3 (token) |
| 5 | Status de ingestão no upload | 2h | Fase 4 |
| 6 | Visualização de fontes | 1h | Fase 4 |

**Dependência externa a adicionar:** `react-router-dom`

```bash
npm install react-router-dom
```

---

## 9. Validação Checklist

> A ser usado após cada fase para garantir que nada quebrou.

- [ ] `npm run build` sem erros
- [ ] `npm run lint` sem warnings
- [ ] Login/register funcionando com credenciais válidas
- [ ] Token inválido redireciona para login
- [ ] Sessions lista com paginação
- [ ] Histórico de mensagens com paginação
- [ ] Envio de mensagem retorna resposta com `role`
- [ ] Upload de arquivo seguido de ingestão com status visível
- [ ] RAG Query retorna resposta com fontes
- [ ] Fontes clicáveis exibem detalhes
- [ ] Health check funcional
