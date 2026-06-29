# Plano de Implementação — Front-end React (Chat + Upload)

## Fase 0 — Setup do Projeto

| Passo | Ação |
|---|---|
| 0.1 | Inicializar projeto com Vite (`npm create vite@latest projeto-ia-frontend -- --template react`) |
| 0.2 | Instalar dependência: `axios` (cliente HTTP) |
| 0.3 | Instalar dependência de desenvolvimento: `eslint-plugin-react-hooks` |
| 0.4 | Configurar `proxy` no `vite.config.js` para redirecionar `/api/*` para o backend Spring Boot |
| 0.5 | Criar `.env` com `VITE_API_BASE_URL=http://localhost:8080` |
| 0.6 | Limpar arquivos boilerplate do Vite (App.css padrão, assets iniciais) |

**Arquivos criados:** `package.json` (modificado), `vite.config.js` (modificado), `.env`, `.env.example`

---

## Fase 1 — Estrutura de Diretórios

| Passo | Ação |
|---|---|
| 1.1 | Criar `src/api/` |
| 1.2 | Criar `src/services/` |
| 1.3 | Criar `src/hooks/` |
| 1.4 | Criar `src/components/chat/` |
| 1.5 | Criar `src/components/upload/` |
| 1.6 | Criar `src/components/session/` |
| 1.7 | Criar `src/components/health/` |
| 1.8 | Criar `src/components/shared/` |
| 1.9 | Criar `src/pages/` |
| 1.10 | Criar `src/layouts/` |
| 1.11 | Criar `src/styles/` |
| 1.12 | Criar `src/utils/` |
| 1.13 | Criar `src/assets/` |

**Arquivos criados:** Apenas diretórios (vazios inicialmente)

---

## Fase 2 — Camada de Infraestrutura (API Layer + Utils)

**Dependências:** Fase 1 concluída

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 2.1 | `src/api/client.js` | Criar instância axios com `baseURL` lido de `import.meta.env.VITE_API_BASE_URL`, configurar `timeout`, headers padrão (`Content-Type: application/json`) |
| 2.2 | `src/api/interceptors.js` | Exportar funções `requestInterceptor` (log, adição de headers), `responseInterceptor` (extração de `response.data`), `errorInterceptor` (normalização de erros para formato `{ message, status }`) |
| 2.3 | `src/utils/constants.js` | Exportar `ACCEPTED_FILE_TYPES = ['.txt', '.pdf']`, `MAX_FILE_SIZE` (ex.: 10MB), `HEALTH_POLL_INTERVAL = 30000`, `API_STATUS` enum |
| 2.4 | `src/utils/validators.js` | Exportar `isValidFileType(file)` (verifica extensão/MIME), `isValidFileSize(file)` (verifica limite), `isValidMessage(text)` (non-empty após trim) |
| 2.5 | `src/utils/formatters.js` | Exportar `formatFileSize(bytes)`, `formatTimestamp(isoString)`, `truncateText(text, maxLength)` |

---

## Fase 3 — Serviços (Services)

**Dependências:** Fase 2 concluída (API client + utils)

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 3.1 | `src/services/healthService.js` | Função `checkHealth()` — `GET /api/health`, retorna `{ status, version, timestamp }` |
| 3.2 | `src/services/chatService.js` | Função `sendMessage(sessionId, text)` — `POST /api/chat` com body `{ sessionId, text }`, retorna `{ message, sessionId }`. Função `getHistory(sessionId)` — `GET /api/chat/{sessionId}`, retorna `{ messages, session }` |
| 3.3 | `src/services/uploadService.js` | Função `uploadFile(file, onProgress)` — `POST /api/upload` via `FormData` + `XMLHttpRequest` para tracking de progresso (evento `upload.onprogress`). Retorna Promise com `{ fileId, fileName, size, status, message }` |

---

## Fase 4 — Custom Hooks

**Dependências:** Fase 3 concluída (services prontos)

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 4.1 | `src/hooks/useHealthCheck.js` | Estados: `apiStatus`, `lastCheck`, `isChecking`. Funções: `checkHealth()`, `startPolling(intervalMs)`, `stopPolling()`. `useEffect` de cleanup do intervalo. Chama `healthService.checkHealth()` |
| 4.2 | `src/hooks/useChat.js` | Estados: `messages`, `isLoading`, `error`, `currentSessionId`. Funções: `sendMessage(text)`, `loadSession(sessionId)`, `clearMessages()`, `createNewSession()`. Chama `chatService.sendMessage()` e `chatService.getHistory()` |
| 4.3 | `src/hooks/useHistory.js` | Estados: `sessions`, `isLoadingSessions`, `errorSessions`. Funções: `fetchSessions()`, `selectSession(sessionId)`. Chama `chatService.getHistory()` (reusa) |
| 4.4 | `src/hooks/useUpload.js` | Estados: `selectedFiles`, `uploadProgress`, `uploadStatus`, `uploadError`. Funções: `addFiles(files)`, `removeFile(index)`, `startUpload()`, `resetUpload()`. Chama `uploadService.uploadFile()`. Valida arquivos com `validators.js` |

---

## Fase 5 — Componentes Compartilhados (Shared)

**Dependências:** Podem ser criados antes dos hooks por serem puramente de apresentação

| Ordem | Arquivo | Props |
|---|---|---|
| 5.1 | `src/components/shared/Button.jsx` | `children`, `variant` ('primary'/'secondary'/'ghost'), `onClick`, `disabled`, `type`, `ariaLabel` |
| 5.2 | `src/components/shared/Spinner.jsx` | `size` ('sm'/'md'/'lg'), `color` |
| 5.3 | `src/components/shared/ErrorMessage.jsx` | `message`, `onRetry`, `variant` ('inline'/'full') |
| 5.4 | `src/components/shared/Icon.jsx` | `name`, `size`, `ariaHidden` |

---

## Fase 6 — Componentes de Domínio (Chat, Upload, Session, Health)

**Dependências:** Fase 5 concluída (shared components)

| Ordem | Arquivo | Props |
|---|---|---|
| 6.1 | `src/components/chat/MessageBubble.jsx` | `message: { text, sender, timestamp }`, `isUser: boolean` |
| 6.2 | `src/components/chat/ChatHeader.jsx` | `sessionName`, `sessionId` |
| 6.3 | `src/components/chat/MessageInput.jsx` | `onSend(text)`, `isDisabled` |
| 6.4 | `src/components/chat/ChatWindow.jsx` | `messages[]`, `isLoading`, `currentSessionId` |
| 6.5 | `src/components/session/SessionItem.jsx` | `session: { id, name, lastMessage, timestamp }`, `isActive`, `onClick` |
| 6.6 | `src/components/session/SessionList.jsx` | `sessions[]`, `activeSessionId`, `onSelect(id)` |
| 6.7 | `src/components/upload/ProgressBar.jsx` | `progress` (0–100), `status` ('idle'/'uploading'/'success'/'error') |
| 6.8 | `src/components/upload/FileItem.jsx` | `file: { name, size, type }`, `onRemove(index)` |
| 6.9 | `src/components/upload/UploadButton.jsx` | `onClick`, `disabled` |
| 6.10 | `src/components/upload/DropZone.jsx` | `onDrop(files)`, `disabled`, `children` |
| 6.11 | `src/components/health/StatusDot.jsx` | `status` ('online'/'offline'/'checking') |
| 6.12 | `src/components/health/HealthIndicator.jsx` | `status`, `lastCheck`, `onClick` (força verificação) |

---

## Fase 7 — Layouts

**Dependências:** Fase 5 e 6 concluídas

| Ordem | Arquivo | Props / Conteúdo |
|---|---|---|
| 7.1 | `src/layouts/Sidebar.jsx` | `children` — renderiza `SessionList` e `HealthIndicator` |
| 7.2 | `src/layouts/ContentArea.jsx` | `children` — renderiza `ChatWindow` + `MessageInput` + `DropZone` |
| 7.3 | `src/layouts/MainLayout.jsx` | `sidebar`, `content` — estrutura grid com sidebar (esquerda, 300px) e content area (flexível) |

---

## Fase 8 — Páginas

**Dependências:** Fase 4, 6 e 7 concluídas

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 8.1 | `src/pages/ChatPage.jsx` | Página principal que instancia `useChat`, `useHistory`, `useUpload`, `useHealthCheck` e conecta os estados/funções aos componentes de layout. Composição: `MainLayout` > `Sidebar`(`SessionList` + `HealthIndicator`) + `ContentArea`(`ChatWindow` + `MessageInput` + `DropZone`) |

---

## Fase 9 — Estilos Globais e Estilização

**Dependências:** Fase 5–8 concluídas (para aplicar classes nos componentes)

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 9.1 | `src/styles/variables.css` | Variáveis CSS: cores (`--color-primary`, `--color-bg`, etc.), fontes, spacing, border-radius, breakpoints, shadow |
| 9.2 | `src/styles/reset.css` | Reset CSS moderno (box-sizing, margin/padding zero, font-family base) |
| 9.3 | `src/styles/global.css` | Estilos globais: import de `variables.css` e `reset.css`, classes utilitárias, estilos de scroll, animações de fade-in/skeleton |

---

## Fase 10 — Integração Final

**Dependências:** Todas as fases anteriores concluídas

| Ordem | Ação |
|---|---|
| 10.1 | Atualizar `src/App.jsx` — importar `ChatPage`, renderizar dentro de um fragment |
| 10.2 | Atualizar `src/main.jsx` — importar `global.css`, renderizar `<App />` com `React.StrictMode` |
| 10.3 | Remover/limpar `src/App.css` e `src/index.css` se existirem |
| 10.4 | Executar `npm run dev` para verificar se a aplicação compila |
| 10.5 | Testar manualmente o fluxo (inspetor do navegador, console, network tab) |

---

## Grafo de Dependências entre Fases

```
Fase 0 (Setup)
   └── Fase 1 (Diretórios)
          ├── Fase 2 (API + Utils)
          │      └── Fase 3 (Services)
          │             └── Fase 4 (Hooks) ────────────┐
          │                    │                       │
          │                    ├── Fase 5 (Shared) ────┤
          │                    │       │               │
          │                    │       └── Fase 6 ─────┤
          │                    │              │        │
          │                    │              └── Fase 7
          │                    │                     │
          │                    └─────────────────────┼── Fase 8 (Pages)
          │                                          │
          └──────────────────────────────────────────┼── Fase 9 (Styles)
                                                     │
                                                     └── Fase 10 (Integração)
```

---

## Arquivos a Criar (~41 arquivos no total)

| Fase | Quantidade | Arquivos |
|---|---|---|
| Fase 0 | 4 | `vite.config.js`, `.env`, `.env.example`, `package.json` (mod) |
| Fase 2 | 5 | `client.js`, `interceptors.js`, `constants.js`, `validators.js`, `formatters.js` |
| Fase 3 | 3 | `healthService.js`, `chatService.js`, `uploadService.js` |
| Fase 4 | 4 | `useHealthCheck.js`, `useChat.js`, `useHistory.js`, `useUpload.js` |
| Fase 5 | 4 | `Button.jsx`, `Spinner.jsx`, `ErrorMessage.jsx`, `Icon.jsx` |
| Fase 6 | 12 | `MessageBubble.jsx`, `ChatHeader.jsx`, `MessageInput.jsx`, `ChatWindow.jsx`, `SessionItem.jsx`, `SessionList.jsx`, `ProgressBar.jsx`, `FileItem.jsx`, `UploadButton.jsx`, `DropZone.jsx`, `StatusDot.jsx`, `HealthIndicator.jsx` |
| Fase 7 | 3 | `Sidebar.jsx`, `ContentArea.jsx`, `MainLayout.jsx` |
| Fase 8 | 1 | `ChatPage.jsx` |
| Fase 9 | 3 | `variables.css`, `reset.css`, `global.css` |
| Fase 10 | 2 | `App.jsx` (mod), `main.jsx` (mod) |

---

## Validação Pós-Implementação

Após a Fase 10, os seguintes checks devem ser feitos:

1. **Compilação:** `npm run dev` inicia sem erros
2. **Rotas:** Todas as chamadas de API aparecem no Network tab com os endpoints corretos
3. **Estados:** Loading, empty, error e success states são visíveis para cada funcionalidade
4. **Upload:** Arquivos .txt/.pdf são enviados; outros formatos são rejeitados no Front-end
5. **Drag-and-drop:** Área de drop responde visualmente ao arrastar arquivos
6. **Health Check:** Indicador muda de cor conforme resposta da API
7. **Histórico:** Sessões são carregadas e ao clicar, mensagens correspondentes aparecem
8. **Acessibilidade:** Todos os componentes interativos possuem `aria-label` ou `role` apropriados
