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

## Back-end

O repositório do back-end está disponível em:

```
https://github.com/DiaMont30/Trabalho-IA-Back.git
```

### Estrutura do Back-end

```
Trabalho-IA-Back/
├── .env
├── pom.xml
├── docs/
├── uploads/
├── src/
│   ├── main/
│   │   ├── java/com/plataforma/conversacional/
│   │   │   ├── config/
│   │   │   ├── constants/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   │   ├── internal/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── entity/
│   │   │   ├── enums/
│   │   │   ├── event/
│   │   │   ├── exception/
│   │   │   ├── health/
│   │   │   ├── mapper/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   │   └── impl/
│   │   │   ├── specification/
│   │   │   ├── storage/
│   │   │   ├── strategy/
│   │   │   ├── util/
│   │   │   └── validation/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
└── target/
    └── conversacional-0.0.1-SNAPSHOT.jar
```

### Tecnologias do Back-end

| Tecnologia | Finalidade |
|---|---|
| Java 17 | Linguagem de programação |
| Spring Boot 3.2 | Framework web |
| Spring Data JPA | Camada de persistência com Hibernate |
| Spring Security | Autenticação e controle de acesso |
| PostgreSQL | Banco de dados relacional |
| MapStruct | Mapeamento entre entidades e DTOs |
| SpringDoc OpenAPI | Documentação da API (Swagger) |
| Spring Dotenv | Carregamento de variáveis do `.env` |

### Pré-requisitos do Back-end

- Java 17+
- Maven 3.8+
- PostgreSQL rodando (local ou remoto)

### Como Executar via Maven

```bash
git clone https://github.com/DiaMont30/Trabalho-IA-Back.git
cd Trabalho-IA-Back
```

Crie o arquivo `.env` na raiz com as credenciais do banco:

```env
DB_USERNAME=chatbot
DB_PASSWORD=***
```

Execute:

```bash
mvn spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`.

A documentação Swagger estará em `http://localhost:8080/swagger-ui/index.html`.

### Como Executar via .jar

Pré-requisito: Java 17+

Baixe o `.jar` disponível em `target/conversacional-0.0.1-SNAPSHOT.jar`, crie o arquivo `.env` no mesmo diretório e execute:

```bash
java -jar conversacional-0.0.1-SNAPSHOT.jar
```

---

## Endpoints Consumidos pelo Front-end

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/api/health` | Verificar disponibilidade da API |
| POST | `/api/auth/login` | Autenticar usuário |
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/chat` | Enviar mensagem |
| GET | `/api/chat/{sessionId}` | Recuperar histórico da sessão |
| POST | `/api/upload` | Upload de arquivos |
| GET | `/api/ingestion/{id}` | Verificar status de ingestão |

---

## Tipos de Arquivos Suportados no Upload

- `.txt`
- `.pdf`

---

## Documentação

A documentação técnica do front-end encontra-se na pasta `docs/`:

- **SYSTEM_DOCS.md** — especificação arquitetural da aplicação
- **IMPLEMENTATION_PLAN.md** — plano de implementação seguido durante o desenvolvimento
- **IMPLEMENTATION_PENDENCIAS_PLAN.md** — pendências e ajustes da implementação
- **SPEC-PENDENCIAS-FRONTEND.md** — especificação das pendências do front-end

---

## Desenvolvimento Assistido por IA

Este projeto utilizou uma ferramenta de IA durante o processo de desenvolvimento.

As regras de utilização, escopo de atuação e metodologia empregada estão documentadas no arquivo `AGENTS.md`.

---

> Projeto desenvolvido como atividade avaliativa da disciplina de Inteligência Artificial — **Serratec Residência de Software**
