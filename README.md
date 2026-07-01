# Projeto IA – Front-end

## Grupo 4

> **Serratec Residência de Software · Sala 34 · Trabalho avaliativo · disciplina de Inteligência Artificial**

---

## Integrantes

- DIANA MONTEIRO
- GABRIEL AGUIAR
- KAIQUE ABRANCHES
- ROBERTA ROCHA

---

## Sobre o Projeto

Este repositório contém o **Front-end** da plataforma conversacional com suporte a upload de arquivos e autenticação, desenvolvida como trabalho avaliativo da disciplina de Inteligência Artificial do **Serratec**.

A aplicação foi construída com **React 19** e segue uma arquitetura em camadas baseada em componentes, priorizando desacoplamento, reutilização de código e facilidade de manutenção.

O front-end consome uma API REST desenvolvida em **Spring Boot**, responsável pelo gerenciamento de sessões de chat, upload de documentos, autenticação e monitoramento da aplicação.

---

## Objetivos da Etapa

Funcionalidades implementadas nesta etapa:

- Autenticação de usuário (login e registro);
- Interface de chat para envio e recebimento de mensagens;
- Histórico de conversas por sessão;
- Upload de arquivos `.txt` e `.pdf` com suporte a Drag-and-Drop;
- Barra de progresso e status de ingestão durante o upload;
- Monitoramento do status da API através do endpoint `/api/health`.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 8 | Bundler e servidor de desenvolvimento |
| JavaScript | ES6+ | Linguagem |
| React Router DOM | 7 | Roteamento entre páginas |
| Axios | 1.18+ | Requisições HTTP |
| CSS3 | — | Estilização |

---

## Estrutura do Projeto

```
Trabalho-IA-Front/
│
├── docs/
│   ├── SYSTEM_DOCS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── IMPLEMENTATION_PENDENCIAS_PLAN.md
│   └── SPEC-PENDENCIAS-FRONTEND.md
│
├── src/
│   ├── api/
│   │   └── interceptors.js
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── health/
│   │   │   ├── HealthIndicator.jsx
│   │   │   └── StatusDot.jsx
│   │   ├── session/
│   │   │   ├── SessionItem.jsx
│   │   │   └── SessionList.jsx
│   │   ├── shared/
│   │   │   ├── Button.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Icon.jsx
│   │   │   └── Spinner.jsx
│   │   └── upload/
│   │       ├── DropZone.jsx
│   │       ├── FileItem.jsx
│   │       ├── IngestionStatus.jsx
│   │       ├── ProgressBar.jsx
│   │       └── UploadButton.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useHealthCheck.js
│   │   ├── useHistory.js
│   │   ├── useIngestionStatus.js
│   │   └── useUpload.js
│   │
│   ├── layouts/
│   │   ├── ContentArea.jsx
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── healthService.js
│   │   ├── ingestionService.js
│   │   ├── tokenService.js
│   │   └── uploadService.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## Arquitetura

O projeto foi organizado seguindo os princípios de separação de responsabilidades.

### Components

Responsáveis exclusivamente pela renderização da interface.

Não possuem regras de negócio nem chamadas HTTP. Divididos em subgrupos por domínio: `chat`, `health`, `session`, `shared` e `upload`.

---

### Hooks

Concentram toda a lógica da aplicação.

Responsáveis pelo gerenciamento de estados, efeitos colaterais e orquestração da comunicação com os serviços.

---

### Services

Responsáveis pela comunicação com a API REST.

Toda requisição HTTP passa por esta camada.

---

### API Layer

Centraliza a configuração do cliente HTTP, interceptadores e configurações globais de comunicação.

---

### Utils

Contém funções auxiliares, constantes e validações reutilizáveis em toda a aplicação.

---

## Fluxo da Aplicação

```
Usuário
  ↓
Componentes React
  ↓
Custom Hooks
  ↓
Services
  ↓
API Layer (Axios + interceptors)
  ↓
Spring Boot (Back-end)
  ↓
Resposta da API
  ↓
Atualização do estado
  ↓
Renderização da interface
```

---

## Pré-requisitos

- Node.js 18 ou superior
- npm
- Back-end em execução (veja a seção [Back-end](#back-end))

---

## Como Executar o Front-end

### 1. Clone o repositório

```bash
git clone https://github.com/gaguiar4/Trabalho-IA-Front.git
cd Trabalho-IA-Front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## Desenvolvimento Assistido por IA

Este projeto utilizou uma ferramenta de IA durante o processo de desenvolvimento.
As regras de utilização, escopo de atuação e metodologia empregada estão documentadas no arquivo `AGENTS.md`.

---

> Projeto desenvolvido como atividade avaliativa da disciplina de Inteligência Artificial — **Serratec Residência de Software**
