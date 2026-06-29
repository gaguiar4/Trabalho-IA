# Documento de Especificação do Sistema — System Docs

## Front-end SPA — Chat Inteligente com Upload

---

## 1. Objetivo do Projeto

Construir uma Single Page Application (SPA) em React que funcione como interface de usuário para um sistema de chat com inteligência artificial. A aplicação consumirá uma API REST desenvolvida em Spring Boot, oferecendo funcionalidades de troca de mensagens em tempo real (comunicação síncrona via HTTP), upload de arquivos nos formatos .txt e .pdf com área de drag-and-drop e barra de progresso, exibição do histórico de conversas segmentado por sessão, e monitoramento do status da API via health check. O projeto adota uma arquitetura baseada em componentes, com clara separação entre camada de apresentação, lógica de negócio e comunicação com o backend, seguindo os princípios de Clean Code, SOLID e Spec-Driven Development. O Front-end será mantido em repositório independente, sem acoplamento com o Back-end.

---

## 2. Arquitetura Geral

A arquitetura proposta segue o padrão de **Camadas (Layered Architecture)** com separação explícita de responsabilidades, organizada em quatro camadas principais:

### Interface (Componentes React)
Responsável exclusivamente pela renderização da UI e captura de eventos do usuário. Componentes são puros e não contêm lógica de negócio. Toda mutação de estado ou efeito colateral é delegada a Custom Hooks.

### Hooks (Custom Hooks)
Camada intermediária que conecta a Interface aos Serviços. Cada Hook encapsula um domínio de estado (mensagens, upload, health check) e expõe para os componentes dados e funções de ação. Os Hooks gerenciam estados locais (useState) e efeitos colaterais (useEffect), mas nunca realizam chamadas HTTP diretamente.

### Services (Serviços)
Camada responsável por toda a comunicação com a API REST. Cada Service é uma função ou conjunto de funções que realizam requisições HTTP (fetch/axios) e retornam dados processados. Services não conhecem componentes nem hooks — são puramente funções de requisição/resposta.

### API Layer (Camada de Configuração HTTP)
Camada de infraestrutura que centraliza a configuração do cliente HTTP (base URL, headers, interceptors, tratamento de erros). Fornece uma instância configurada que os Services utilizam, garantindo consistência nas requisições e facilitando manutenção.

### Fluxo de Comunicação

```
Interface (Componente)
    ↓  ação do usuário (onClick, onSubmit, onChange)
Hook (Custom Hook)
    ↓  chama função do serviço
Service (Função HTTP)
    ↓  requisição via API Layer
API Layer (Cliente HTTP configurado)
    ↓  HTTP Request
API Spring Boot (Back-end)
    ↑  HTTP Response
API Layer
    ↑  resposta bruta
Service
    ↑  dado transformado/tratado
Hook
    ↑  atualiza estado (setState)
Interface
    ↑  re-renderiza com novos dados
```

---

## 3. Estrutura de Diretórios

```
projeto-ia-frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── api/
│   │   ├── client.js
│   │   └── interceptors.js
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── ChatHeader.jsx
│   │   │
│   │   ├── upload/
│   │   │   ├── DropZone.jsx
│   │   │   ├── FileItem.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── UploadButton.jsx
│   │   │
│   │   ├── session/
│   │   │   ├── SessionList.jsx
│   │   │   └── SessionItem.jsx
│   │   │
│   │   ├── health/
│   │   │   ├── HealthIndicator.jsx
│   │   │   └── StatusDot.jsx
│   │   │
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── Spinner.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── Icon.jsx
│   │
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useHistory.js
│   │   ├── useUpload.js
│   │   └── useHealthCheck.js
│   │
│   ├── services/
│   │   ├── chatService.js
│   │   ├── uploadService.js
│   │   └── healthService.js
│   │
│   ├── pages/
│   │   └── ChatPage.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── ContentArea.jsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── reset.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   └── App.jsx
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Componentes

| Componente | Responsabilidade | Props Esperadas | Dependências |
|---|---|---|---|
| ChatPage | Página principal que orquestra o layout e conecta hooks aos componentes de apresentação | Nenhuma (usa hooks internamente) | MainLayout, ChatWindow, SessionList, HealthIndicator, DropZone |
| MainLayout | Estrutura o layout grid da aplicação (sidebar + área de conteúdo) | `children` (ReactNode) | Nenhuma |
| Sidebar | Container do histórico de sessões e indicador de saúde da API | `children` (ReactNode) | Nenhuma |
| ContentArea | Container da área principal de conteúdo (chat + upload) | `children` (ReactNode) | Nenhuma |
| ChatWindow | Renderiza a lista de mensagens da conversa atual com scroll automático | `messages` (array), `isLoading` (boolean), `currentSessionId` (string) | MessageBubble |
| MessageBubble | Renderiza uma única mensagem do chat (usuário ou bot) | `message` (object: {text, sender, timestamp}), `isUser` (boolean) | Nenhuma |
| MessageInput | Input de texto com botão de envio | `onSend` (function), `isDisabled` (boolean) | Button, Icon |
| ChatHeader | Exibe o título/nome da sessão atual | `sessionName` (string), `sessionId` (string) | Nenhuma |
| DropZone | Área de drag-and-drop para upload de arquivos | `onDrop` (function), `isDragActive` (boolean), `disabled` (boolean) | FileItem, ProgressBar |
| FileItem | Exibe informações de um arquivo selecionado (nome, tamanho) | `file` (object: {name, size, type}), `onRemove` (function) | Icon |
| ProgressBar | Barra de progresso visual do upload | `progress` (number 0–100), `status` (string: 'idle' / 'uploading' / 'success' / 'error') | Nenhuma |
| UploadButton | Botão estilizado para abrir seletor de arquivos | `onClick` (function), `disabled` (boolean) | Nenhuma |
| SessionList | Renderiza a lista de sessões de chat | `sessions` (array), `activeSessionId` (string), `onSelect` (function) | SessionItem |
| SessionItem | Renderiza um item de sessão na lista | `session` (object: {id, name, lastMessage, timestamp}), `isActive` (boolean), `onClick` (function) | Nenhuma |
| HealthIndicator | Exibe o status atual da API (online/offline) com indicador visual | `status` (string: 'online' / 'offline' / 'checking'), `lastCheck` (Date) | StatusDot |
| StatusDot | Bolinha colorida indicando estado (verde/vermelho/cinza) | `color` (string) | Nenhuma |
| Button | Botão reutilizável com variantes visuais | `children` (ReactNode), `variant` (string), `onClick` (function), `disabled` (boolean), `type` (string) | Spinner |
| Spinner | Indicador de carregamento | `size` (string), `color` (string) | Nenhuma |
| ErrorMessage | Exibe mensagens de erro com opção de retry | `message` (string), `onRetry` (function) | Button, Icon |
| Icon | Renderiza ícones SVG inline | `name` (string), `size` (string) | Nenhuma |

---

## 5. Hooks Customizados

| Hook | Responsabilidade | Estados Controlados | Métodos Públicos |
|---|---|---|---|
| useChat | Gerencia o estado da conversa atual: mensagens, envio, recebimento | `messages` (array), `isLoading` (boolean), `error` (string/null), `currentSessionId` (string) | `sendMessage(text)` para enviar nova mensagem, `clearMessages()` para limpar a conversa, `loadSession(sessionId)` para carregar sessão existente |
| useHistory | Gerencia o carregamento e exibição do histórico de sessões | `sessions` (array), `isLoadingSessions` (boolean), `errorSessions` (string/null) | `fetchSessions()` para carregar lista de sessões, `selectSession(sessionId)` para definir sessão ativa |
| useUpload | Gerencia todo o fluxo de upload de arquivos: seleção, drag-and-drop, progresso, cancelamento | `selectedFiles` (array), `uploadProgress` (number), `uploadStatus` (string), `uploadError` (string/null) | `addFiles(files)` para adicionar arquivos à fila, `removeFile(index)` para remover, `startUpload()` para iniciar envio, `resetUpload()` para limpar estado |
| useHealthCheck | Gerencia o monitoramento periódico do status da API | `apiStatus` (string), `lastCheck` (Date/null), `isChecking` (boolean) | `checkHealth()` para disparar verificação manual, `startPolling(intervalMs)` para iniciar monitoramento automático, `stopPolling()` para interromper |

---

## 6. Serviços

| Serviço | Responsabilidade | Funções |
|---|---|---|
| chatService | Responsável por toda comunicação relacionada ao chat: envio de mensagens e recuperação de histórico | `sendMessage(sessionId, text)` — envia mensagem via POST /api/chat e retorna a resposta do assistente. `getHistory(sessionId)` — busca o histórico da sessão via GET /api/chat/{sessionId} e retorna array de mensagens |
| uploadService | Responsável pelo upload de arquivos para o servidor | `uploadFile(file, onProgress)` — envia arquivo via POST /api/upload com monitoramento de progresso (XMLHttpRequest com evento de progresso ou fetch com ReadableStream). Retorna resposta de confirmação |
| healthService | Responsável pela verificação de saúde da API | `checkHealth()` — realiza GET /api/health e retorna status e metadados da API |

---

## 7. Fluxo de Dados

O fluxo de dados segue uma direção unidirecional e previsível, garantindo rastreabilidade e testabilidade:

### Fluxo de Envio de Mensagem (Chat)

1. **Usuário** digita uma mensagem no campo `MessageInput` e pressiona Enter ou clica em enviar.
2. `MessageInput` chama a função `onSend(text)` recebida via props, disparada pelo `useChat`.
3. `useChat` imediatamente otimiza a interface: adiciona a mensagem do usuário ao estado `messages` com flag temporária, define `isLoading = true` e `error = null`.
4. `useChat` invoca `chatService.sendMessage(currentSessionId, text)`.
5. `chatService` utiliza o cliente HTTP da `API Layer` para realizar `POST /api/chat` com `{ sessionId, text }` no body.
6. A `API Layer` envia a requisição ao servidor Spring Boot, incluindo headers de conteúdo e tratando erros de rede.
7. O servidor processa e retorna a resposta: `{ message: { text, sender, timestamp }, sessionId }`.
8. `chatService` recebe a resposta bruta, valida o formato e retorna o objeto de mensagem tratado.
9. `useChat` recebe a resposta do serviço, atualiza o estado `messages` anexando a mensagem do assistente, e define `isLoading = false`.
10. A interface re-renderiza: `ChatWindow` exibe as duas novas mensagens (usuário + assistente) com scroll automático para a última.

### Fluxo de Upload

1. **Usuário** arrasta arquivos para `DropZone` ou clica em `UploadButton` para selecionar.
2. `DropZone` captura os arquivos e chama `addFiles(files)` do `useUpload`.
3. `useUpload` atualiza `selectedFiles` com os novos arquivos validados (tipo .txt/.pdf, tamanho).
4. O usuário confirma o upload. `UploadButton` ou gatilho automático chama `startUpload()`.
5. `useUpload` define `uploadStatus = 'uploading'`, `uploadProgress = 0`, e inicia o envio via `uploadService.uploadFile(file, onProgressCallback)`.
6. `uploadService` utiliza `XMLHttpRequest` (ou fetch com progress tracking) para realizar `POST /api/upload` com `FormData` contendo o arquivo.
7. A cada evento de progresso, `onProgressCallback` é invocado, e `useUpload` atualiza `uploadProgress`.
8. Ao concluir, `uploadService` retorna a resposta. `useUpload` define `uploadStatus = 'success'`, `uploadProgress = 100`.
9. Se houver erro, `useUpload` define `uploadStatus = 'error'` e `uploadError = mensagem`.
10. A interface re-renderiza: `ProgressBar` reflete o progresso em tempo real, e `FileItem` exibe o estado final (sucesso/erro).

---

## 8. Contratos da API

### GET /api/health

| Campo | Descrição |
|---|---|
| Objetivo | Verificar se a API está operacional e obter informações sobre sua versão e status |
| Dados enviados | Nenhum (requisição GET sem body) |
| Dados recebidos | Objeto contendo `status` (string), `version` (string), `timestamp` (ISO datetime) |
| Comportamento Front-end | Ao carregar a página, o hook `useHealthCheck` dispara a primeira verificação. A cada intervalo configurável (ex.: 30 segundos), uma nova requisição é feita. O componente `HealthIndicator` reflete visualmente se a API está online (verde), offline (vermelho) ou em verificação (cinza). Em caso de falha de rede, o status é definido como offline com a marcação do último check bem-sucedido |

### POST /api/chat

| Campo | Descrição |
|---|---|
| Objetivo | Enviar uma mensagem do usuário e receber a resposta gerada pelo assistente |
| Dados enviados | Body JSON com `sessionId` (string, UUID da sessão) e `text` (string, conteúdo da mensagem) |
| Dados recebidos | Objeto JSON contendo `message` (objeto com `text`, `sender`, `timestamp`) e `sessionId` |
| Comportamento Front-end | O hook `useChat` envia a mensagem via `chatService.sendMessage`. O estado `isLoading` é ativado para exibir um indicador de digitação. A resposta é anexada ao array `messages`. Se a `sessionId` for nova, uma nova sessão é criada no histórico |

### GET /api/chat/{sessionId}

| Campo | Descrição |
|---|---|
| Objetivo | Recuperar o histórico completo de mensagens de uma sessão específica |
| Dados enviados | Parâmetro de path `sessionId` (string) |
| Dados recebidos | Array de objetos `message`, cada um com `text`, `sender`, `timestamp`, e metadados da sessão (`sessionId`, `sessionName`) |
| Comportamento Front-end | Ao selecionar uma sessão no `SessionList`, o hook `useChat.loadSession(sessionId)` é chamado. O histórico é carregado via `chatService.getHistory(sessionId)` e substitui o estado `messages` atual. Um indicador de carregamento é exibido durante a busca |

### POST /api/upload

| Campo | Descrição |
|---|---|
| Objetivo | Enviar um arquivo .txt ou .pdf para processamento pelo servidor |
| Dados enviados | `multipart/form-data` contendo o campo `file` com o arquivo binário e metadados adicionais (sessionId) |
| Dados recebidos | Objeto JSON com `fileId` (string), `fileName` (string), `size` (number), `status` (string), `message` (string, resultado do processamento) |
| Comportamento Front-end | O hook `useUpload` gerencia o envio com monitoramento de progresso. O usuário vê a barra de progresso ser preenchida em tempo real. Ao final, o arquivo é marcado como enviado com sucesso ou exibido erro. Mensagens de confirmação podem ser adicionadas ao chat |

---

## 9. Gerenciamento de Estado

O estado global da aplicação é distribuído entre os Custom Hooks, cada um responsável por seu domínio. Não há estado global centralizado (como Redux ou Context) — cada hook gerencia seu próprio estado local. A comunicação entre hooks pode ser feita via props do componente pai ou, se necessário no futuro, via Context API para estados que precisam ser compartilhados entre múltiplos componentes em diferentes níveis.

### Estados por Domínio

| Domínio | Variável de Estado | Tipo | Descrição |
|---|---|---|---|
| Chat | `messages` | `array` | Lista de objetos `{ id, text, sender, timestamp }` da conversa atual |
| Chat | `isLoading` | `boolean` | Indica se o envio de mensagem está em andamento (exibe indicador de digitação) |
| Chat | `error` | `string \| null` | Mensagem de erro em caso de falha no envio |
| Chat | `currentSessionId` | `string` | Identificador da sessão ativa no momento |
| Histórico | `sessions` | `array` | Lista de objetos `{ id, name, lastMessage, timestamp }` das sessões disponíveis |
| Histórico | `isLoadingSessions` | `boolean` | Indica carregamento da lista de sessões |
| Histórico | `errorSessions` | `string \| null` | Mensagem de erro ao carregar sessões |
| Upload | `selectedFiles` | `array` | Lista de arquivos selecionados para upload |
| Upload | `uploadProgress` | `number` | Progresso atual (0–100) durante o envio |
| Upload | `uploadStatus` | `string` | Estado do upload: `'idle' \| 'uploading' \| 'success' \| 'error'` |
| Upload | `uploadError` | `string \| null` | Mensagem de erro no upload |
| Health | `apiStatus` | `string` | Status da API: `'online' \| 'offline' \| 'checking'` |
| Health | `lastCheck` | `Date \| null` | Timestamp da última verificação bem-sucedida |
| Health | `isChecking` | `boolean` | Indica se a verificação está em andamento |

---

## 10. Fluxo das Funcionalidades

### Fluxo do Chat

1. O usuário acessa a aplicação. Uma nova sessão é criada automaticamente com UUID gerado pelo Front-end (ou pelo Back-end na primeira mensagem).
2. O `ChatPage` renderiza `ChatWindow` (vazio), `MessageInput` e `SessionList`.
3. O usuário digita e envia uma mensagem. `useChat.sendMessage(text)` é invocado.
4. A mensagem do usuário aparece imediatamente na tela (otimista). O indicador de digitação é exibido.
5. O serviço `chatService` envia a requisição POST. A resposta é processada.
6. A mensagem do assistente é anexada ao array de mensagens. O indicador de digitação desaparece.
7. O scroll da `ChatWindow` é automaticamente levado ao final.
8. O usuário pode iniciar uma nova sessão a qualquer momento, limpando as mensagens atuais (nova sessionId).

### Fluxo do Upload

1. O usuário visualiza a `DropZone` na interface. Pode arrastar arquivos ou clicar para abrir o seletor.
2. Ao soltar os arquivos na `DropZone`, o hook `useUpload.addFiles()` é chamado. Apenas arquivos .txt e .pdf são aceitos (validação por extensão e MIME type).
3. Os arquivos válidos são listados como `FileItem` com nome e tamanho.
4. O usuário pode remover arquivos individualmente.
5. Ao confirmar (clicando em enviar ou automaticamente), `useUpload.startUpload()` inicia o envio.
6. A `ProgressBar` é renderizada para cada arquivo, atualizando em tempo real.
7. Ao finalizar, o status de cada arquivo é exibido (sucesso ou erro).
8. O upload pode ser redefinido para nova seleção.

### Fluxo do Histórico

1. Ao carregar a página, o hook `useHistory.fetchSessions()` é chamado automaticamente para carregar a lista de sessões.
2. A `SessionList` exibe todas as sessões disponíveis com nome e data da última mensagem.
3. Ao clicar em uma sessão, o hook `useHistory.selectSession(sessionId)` atualiza o `currentSessionId`.
4. O hook `useChat.loadSession(sessionId)` é chamado para carregar as mensagens da sessão selecionada.
5. A `ChatWindow` é limpa e preenchida com o histórico de mensagens daquela sessão.
6. A sessão ativa é destacada visualmente na `SessionList`.
7. Se o número de sessões for grande, a lista deve ser scrollável.

### Fluxo do Monitoramento da API

1. Ao montar o `ChatPage`, o hook `useHealthCheck.startPolling(interval)` é iniciado (ex.: 30000ms).
2. A cada intervalo, `healthService.checkHealth()` é invocado.
3. O estado `apiStatus` é atualizado: `'checking'` durante a requisição, `'online'` em sucesso, `'offline'` em falha.
4. O `HealthIndicator` re-renderiza com a cor correspondente (verde/cinza/vermelho) e o timestamp do último check.
5. Se a página for fechada ou o componente desmontado, `useHealthCheck.stopPolling()` limpa o intervalo, prevenindo memory leaks.
6. O usuário pode clicar no indicador para forçar uma verificação manual.

---

## 11. Responsabilidade das Camadas

### Pages
Camada de mais alto nível. Orquestra a composição dos layouts e componentes de apresentação, conecta os Custom Hooks aos componentes via props. Uma Page não contém lógica de negócio nem chamadas a serviços — seu papel é puramente de composição e "cola" entre hooks e componentes. Exemplo: `ChatPage` renderiza `MainLayout` com `Sidebar` e `ContentArea`, e passa os estados e callbacks dos hooks para os componentes filhos.

### Components
Responsabilidade única de apresentação e captura de eventos. Não contêm lógica de negócio, estados complexos ou efeitos colaterais. São funções puras (ou quase puras) que recebem dados via `props` e renderizam JSX. Quando um evento ocorre (clique, submit, drag), o componente chama a função recebida via prop, sem saber o que essa função faz. Isso garante testabilidade máxima e reuso.

### Hooks
Contêm toda a lógica de estado, efeitos colaterais e orquestração de serviços. São a ponte entre a camada de apresentação (Componentes) e a camada de dados (Services). Cada Hook encapsula um domínio específico gerindo seu próprio estado com `useState`, efeitos com `useEffect` (ex.: polling, carregamento inicial) e chamadas a funções de serviço. Hooks retornam objetos com estado + funções que os componentes consomem.

### Services
Contêm a lógica de comunicação HTTP. São funções puras que recebem parâmetros, invocam o cliente HTTP configurado (API Layer), processam a resposta (validação, transformação) e retornam dados limpos. Services não conhecem React, hooks, componentes ou estado. Isso permite que sejam testados independentemente e reutilizados em diferentes contextos.

### API Layer
Camada de infraestrutura que configura e exporta uma instância do cliente HTTP (ex.: axios instance ou fetch wrapper). Define base URL a partir de variável de ambiente, configura headers padrão (Content-Type, Accept), implementa interceptors para tratamento global de erros (ex.: 401, 500, timeout) e logging. Todas as requisições do sistema passam por esta camada, garantindo consistência e um único ponto de manutenção para configuração HTTP.

---

## 12. Validação da Arquitetura

### Spec-Driven Development
Esta especificação define de forma exaustiva cada componente, hook, serviço, fluxo e contrato de API antes de qualquer linha de código ser escrita. A implementação futura será guiada estritamente por este documento, garantindo que o código entregue corresponda exatamente ao que foi especificado e validado.

### Clean Code
A arquitetura favorece nomes descritivos, funções pequenas com responsabilidade única, baixo acoplamento, alta coesão e ausência de side effects nas camadas de apresentação. Cada módulo tem um propósito claro e declarado.

### SOLID
- **Single Responsibility Principle**: Cada componente, hook e serviço tem exatamente uma responsabilidade. `MessageBubble` renderiza mensagens; `useChat` gerencia estado do chat; `chatService` faz chamadas HTTP.
- **Open/Closed Principle**: A arquitetura é extensível via composição. Novos componentes podem ser adicionados sem modificar existentes. Novos hooks podem consumir serviços existentes. Novos endpoints requerem apenas novos serviços.
- **Liskov Substitution Principle**: Componentes compartilhados (Button, Spinner, ErrorMessage) aceitam props padronizadas, podendo ser substituídos por variações sem quebrar o contrato.
- **Interface Segregation**: Props de componentes são mínimas e específicas. Um componente nunca recebe props que não utiliza.
- **Dependency Inversion**: Componentes dependem de abstrações (props/callbacks), não de implementações concretas. Hooks dependem de serviços, que por sua vez dependem da abstração da API Layer.

### Componentização
Componentes são atômicos, reutilizáveis e compostos. O sistema é construído de baixo para cima: componentes simples compõem componentes mais complexos. `MessageBubble` é usado por `ChatWindow`, que é usado por `ChatPage`. A mesma lógica se aplica aos hooks e serviços.

### Separação entre Apresentação e Comportamento
A separação é total e rigorosa: componentes React contêm apenas JSX e eventos delegados. Nenhum componente realiza chamadas HTTP, manipula estado diretamente ou contém lógica de negócio. Toda inteligência está nos Hooks e Services. Isso permite testar a UI separadamente da lógica de negócio e da comunicação com a API.

### Facilidade de Manutenção
A organização em camadas com responsabilidades bem definidas permite que um desenvolvedor localize rapidamente onde fazer uma alteração: se é visual, altera o componente; se é lógica, altera o hook; se é integração, altera o serviço. O acoplamento fraco entre camadas significa que mudanças em uma raramente afetam as outras.

### Escalabilidade
A arquitetura foi projetada para crescer horizontalmente. Novas funcionalidades (ex.: autenticação, notificações, WebSocket) podem ser adicionadas como novos hooks + serviços + componentes sem reestruturar o sistema existente. O padrão de Custom Hooks permite isolar cada novo domínio de estado sem poluir um store global. Se no futuro o estado compartilhado se tornar complexo, a migração para Context API ou bibliotecas de estado (Zustand, Redux) é trivial, pois os hooks já encapsulam todo o estado.

---

**Fim do Documento de Especificação do Sistema (System Docs)**
