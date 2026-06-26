# Projeto IA – Front-end

## 📖 Sobre o Projeto

Este repositório contém o desenvolvimento do **Front-end** da aplicação de chat com suporte a upload de arquivos, desenvolvida como parte da disciplina de Inteligência Artificial do **Serratec**.

A aplicação foi construída utilizando **React** e segue uma arquitetura baseada em componentes, priorizando desacoplamento, reutilização de código e facilidade de manutenção.

O front-end consome uma API REST desenvolvida em **Spring Boot**, responsável pelo gerenciamento das conversas, upload de documentos e monitoramento da aplicação.

---

# 🎯 Objetivos da Etapa

Nesta primeira etapa do projeto, foram implementadas as seguintes funcionalidades:

- Interface de chat para envio e recebimento de mensagens;
- Histórico de conversas por sessão;
- Upload de arquivos `.txt` e `.pdf`;
- Área de upload com suporte a Drag-and-Drop;
- Barra de progresso durante upload;
- Comunicação HTTP síncrona com a API;
- Monitoramento do status da API através do endpoint `/api/health`.

---

# 🛠 Tecnologias Utilizadas

- React
- Vite
- JavaScript (ES6+)
- Axios
- CSS3

---

# 📁 Estrutura do Projeto

```
frontend/
│
├── docs/
│   ├── SYSTEM_DOCS.md
│   └── IMPLEMENTATION_PLAN.md
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
│
├── public/
│
├── README.md
├── package.json
├── vite.config.js
└── .env.example
```

---

# 🏗 Arquitetura

O projeto foi organizado seguindo os princípios de separação de responsabilidades.

### Components

Responsáveis exclusivamente pela renderização da interface.

Não possuem regras de negócio nem chamadas HTTP.

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

# 🔄 Fluxo da Aplicação

```
Usuário

↓

Componentes React

↓

Custom Hooks

↓

Services

↓

API Layer

↓

Spring Boot

↓

Resposta da API

↓

Atualização do estado

↓

Renderização da interface
```

---

# ⚙️ Pré-requisitos

Antes de executar o projeto é necessário possuir instalado:

- Node.js (versão 18 ou superior)
- npm

---

# 🚀 Como Executar

## 1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

---

## 2. Entre na pasta

```bash
cd frontend
```

---

## 3. Instale as dependências

```bash
npm install
```

---

## 4. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 5. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

# 🔌 Comunicação com o Back-end

O front-end consome uma API REST desenvolvida em Spring Boot.

Endpoints utilizados:

| Método | Endpoint | Finalidade |
|---------|----------|------------|
| GET | `/api/health` | Verificar disponibilidade da API |
| POST | `/api/chat` | Enviar mensagem |
| GET | `/api/chat/{sessionId}` | Recuperar histórico |
| POST | `/api/upload` | Upload de arquivos |

---

# 📂 Tipos de Arquivos Suportados

- `.txt`
- `.pdf`

---

# 🧠 Arquitetura de Desenvolvimento

O desenvolvimento deste projeto seguiu a metodologia **Spec-Driven Development (SDD)**.

Antes da implementação do código foram produzidos os seguintes documentos:

- `SYSTEM_DOCS.md`
- `IMPLEMENTATION_PLAN.md`

Esses documentos serviram como base para toda a implementação da aplicação.

---

# 📚 Documentação

A documentação do projeto encontra-se na pasta:

```
docs/
```

Contendo:

- **SYSTEM_DOCS.md** — especificação arquitetural da aplicação.
- **IMPLEMENTATION_PLAN.md** — plano de implementação seguido durante o desenvolvimento.

---

# 🤖 Desenvolvimento Assistido por IA

Este projeto utilizou uma ferramenta de IA durante o processo de desenvolvimento.

As regras de utilização, escopo de atuação e metodologia empregada estão documentadas no arquivo:

```
AGENTS.md
```

---

# 👨‍💻 Autor

Projeto desenvolvido como atividade da disciplina de Inteligência Artificial do **Serratec**.
