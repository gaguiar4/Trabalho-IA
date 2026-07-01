# Plano de Implementação — Parte 2: RAG, Orquestração e Integração Full-Stack

> **Baseado nos specs:** `SYSTEM_DOCS.md`, `IMPLEMENTATION_PLAN.md`, `SPEC-PENDENCIAS-FRONTEND.md`, `IMPLEMENTATION_PENDENCIAS_PLAN.md`
>
> **Atualizado em:** 28/06/2026 — revisão pós-análise do código real do backend
>
> **Objetivo:** Registrar o estado atual de implementação da Parte 2, identificar o que foi concluído e detalhar passo a passo somente o que ainda está pendente.
>
> **Modelo de linguagem:** Ollama rodando em Docker Desktop (`llama3.2` para chat, `nomic-embed-text` para embeddings)
>
> **Responsabilidade:** Frontend — Roberta | Backend — equipe back

---

## Visão Geral da Arquitetura — Parte 2

```
Usuário (Browser)
    ↓ HTTP
Spring Boot (:8080)               ← Backend
    ├─ AsyncIngestionProcessor
    ├─ DefaultRagPipeline
    ├─ OllamaEmbeddingStrategy
    ├─ OllamaChatStrategy
    └─ PostgresVectorStore (pgvector)
    ↓ HTTP (:11434)
Ollama (Docker Desktop)            ← LLM local
    ├─ llama3.2     (geração de texto)
    └─ nomic-embed-text  (embeddings, dim=768)
    ↓ Webhook
n8n (orquestração externa)         ← notificações
```

> **Nota:** O frontend nunca se comunica com Ollama diretamente. Toda a inteligência fica no backend. O frontend apenas consome os endpoints Spring Boot.

---

## Sumário Geral — Estado Atual

| # | Camada | Tarefa | Prioridade | Status |
|---|--------|--------|------------|--------|
| F1 | Frontend | Aumentar timeout do Axios para LLM local | 🔴 Alta | ✅ Concluído |
| F2 | Frontend | Corrigir leitura de `sources` na resposta do chat | 🔴 Alta | ✅ Concluído |
| F3 | Frontend | Criar componente `SourcePanel` | 🟡 Média | ✅ Concluído |
| F4 | Frontend | Atualizar `MessageBubble` com estados visuais RAG | 🟡 Média | ✅ Concluído |
| F5 | Frontend | Estado visual "resposta sem fontes" | 🟢 Baixa | ✅ Concluído |
| B1 | Backend | Configurar conexão com Ollama (Docker) | 🔴 Alta | ✅ Concluído |
| B2 | Backend | Implementar `EmbeddingService` via Ollama | 🔴 Alta | ✅ Concluído |
| B3 | Backend | Pipeline de ingestão (parse → chunk → embed → persist) | 🔴 Alta | ✅ Concluído |
| B4 | Backend | `RagService` (retrieval + montagem de prompt) | 🔴 Alta | ✅ Concluído |
| B5 | Backend | Campo `sources` estruturado na resposta de mensagem | 🔴 Alta | ⚠️ Parcial |
| B6 | Backend | Endpoint `GET /api/v1/documents/{id}/status` | 🟡 Média | ❌ Pendente |
| B7 | Backend | Notificação webhook ao n8n após ingestão | 🟢 Baixa | ✅ Concluído |

---

---

# PARTE 1 — Frontend

---

## Estado Atual — Frontend

Todos os itens do frontend para a Parte 2 estão **concluídos**. A tabela abaixo registra o que foi implementado e em qual arquivo.

| Item | Arquivo alterado/criado | O que foi feito |
|---|---|---|
| F1 — Timeout Axios | `src/api/client.js` | `timeout: 15000` → `timeout: 120000` |
| F2 — Leitura de sources | `src/hooks/useChat.js` | `parseMetadata(response.metadata)` → `response.sources ?? null` nas duas ocorrências; função `parseMetadata` removida |
| F3 — SourcePanel | `src/components/chat/SourcePanel.jsx` | Componente novo criado — renderiza fontes colapsáveis, aviso quando vazio, nada quando null |
| F4 — MessageBubble | `src/components/chat/MessageBubble.jsx` | Bloco `<details>` inline removido; substituído por `<SourcePanel sources={message.sources} />` |
| F5 — Estado sem fontes | `src/components/chat/SourcePanel.jsx` | Tratado dentro do próprio SourcePanel: `sources === []` exibe aviso de conhecimento geral |

---

## Comportamento atual do `SourcePanel`

| `sources` recebido | O que é exibido |
|---|---|
| `null` ou `undefined` | Nada (componente retorna `null`) |
| `[]` (array vazio) | "Resposta baseada no conhecimento geral do modelo (sem documentos)" |
| `[{ documentName, excerpt, relevanceScore }]` | Seção `<details>` colapsável com nome, relevância em % e trecho de cada fonte |

---

## Fluxo Frontend Parte 2 — Completo

```
Usuário faz upload de PDF/TXT
    ↓
uploadService.uploadFile() → POST /api/v1/documents/upload
    ↓ retorna { id: 5 }
ingestionService.triggerIngestion(5) → POST /api/v1/rag/ingest/5
    ↓ retorna { jobId: 1, status: "QUEUED" }
useIngestionStatus("1") inicia polling a cada 3s
    ↓ IngestionStatus.jsx: QUEUED → PARSING → CHUNKING → EMBEDDING → READY
Documento indexado. Usuário digita pergunta.
    ↓
chatService.sendMessage(sessionId, texto) → POST /api/v1/sessions/{id}/messages
    ↓ Backend: embed → busca vetorial → prompt + Ollama → resposta
    ↓ retorna { id, content, sources: [...] }
useChat mapeia: { text: content, sources: response.sources ?? null }
    ↓
MessageBubble renderiza resposta + <SourcePanel sources={message.sources} />
```

---

## Checklist de Validação — Frontend

- [x] `npm run build` sem erros
- [x] `npm run lint` sem erros novos introduzidos
- [x] Timeout de 120 segundos no axios (`src/api/client.js`)
- [x] `useChat.js` lê `response.sources` (não `response.metadata`)
- [x] `SourcePanel.jsx` criado e importado no `MessageBubble.jsx`
- [ ] Upload de PDF seguido de ingestão exibe: QUEUED → PARSING → CHUNKING → EMBEDDING → READY *(depende do backend estar rodando)*
- [ ] Pergunta relacionada ao documento retorna fontes visíveis *(depende de B5 do backend)*
- [ ] Pergunta fora do escopo exibe aviso "sem documentos" *(depende de B5 do backend)*
- [ ] Histórico de sessões mostra fontes nas mensagens antigas *(depende de B5 do backend)*

> **Bloqueio:** os últimos 4 itens dependem da conclusão do item **B5 do backend**. O frontend está pronto — o gap está na resposta da API.

---

---

# PARTE 2 — Backend

---

## Estado Atual — Backend

O backend possui uma implementação **enterprise-grade** do pipeline RAG. A grande maioria do trabalho está concluída. Restam **dois itens pendentes**, sendo um deles crítico para a integração com o frontend.

### O que já está implementado e funcionando

| Componente | Classe(s) | Status |
|---|---|---|
| Configuração Ollama | `RestTemplateConfig`, `application.yml`, `docker-compose.yml` | ✅ |
| EmbeddingService | `EmbeddingStrategy` + `OllamaEmbeddingStrategy` (dim=768) | ✅ |
| Parser de documentos | `DocumentParser` interface + `PdfParser` (PDFBox) + `TxtParser` | ✅ |
| Chunking | `ChunkingStrategy` + `FixedSizeChunker` + `RecursiveChunker` | ✅ |
| Pipeline de ingestão async | `AsyncIngestionProcessor` + `PipelineJob` com status | ✅ |
| Vector store com pgvector | `PostgresVectorStore` (query com operador `<=>`) | ✅ |
| RagService / Retrieval | `DefaultRagPipeline` + `SimilarityRetriever` | ✅ |
| RAG integrado ao chat | `MessageServiceImpl.send()` executa RAG quando há docs indexados | ✅ |
| Webhook n8n | `RestN8nWebhookClient` (fire-and-forget, flag `app.n8n.enabled`) | ✅ |
| Autenticação JWT | `JwtTokenProvider` + `SecurityConfig` | ✅ |
| Exception handling | `GlobalExceptionHandler` com status codes corretos | ✅ |

---

## ⚠️ B5 — Campo `sources` estruturado na resposta de mensagem

### Diagnóstico

Este é o **único item que bloqueia a integração com o frontend**.

O `MessageServiceImpl.send()` já executa o RAG corretamente e tem as fontes em mãos. Porém, em vez de retorná-las como array estruturado no campo `sources`, ele as **serializa como JSON string** no campo `metadata`:

```java
// MessageServiceImpl.java — comportamento ATUAL (linhas 130-141)
List<Map<String, Object>> sourcesMeta = sourceRefs.stream()
    .map(ref -> {
        Map<String, Object> m = new HashMap<>();
        m.put("documentId", ref.getChunk().getDocument().getId());
        m.put("documentName", ref.getChunk().getDocument().getOriginalName());
        m.put("relevanceScore", ref.getRelevanceScore());
        m.put("excerpt", ref.getExcerpt());
        return m;
    }).toList();
assistantMessage.setMetadata(objectMapper.writeValueAsString(sourcesMeta));
// ↑ fontes viram uma String JSON gravada no campo metadata
```

O `MessageResponse` retornado pela API:

```java
// MessageResponse.java — ATUAL
public record MessageResponse(
    Long id, Long sessionId, String content,
    MessageRole role, MessageStatus status,
    String createdAt, String updatedAt,
    String metadata   // ← fontes chegam aqui como texto, não como array
) {}
```

O que o frontend recebe hoje:
```json
{
  "content": "A taxa de juros é 12%...",
  "metadata": "[{\"documentId\":5,\"documentName\":\"relatorio.pdf\",...}]",
  "sources": null
}
```

O que o frontend espera (e o `SourcePanel` precisa para funcionar):
```json
{
  "content": "A taxa de juros é 12%...",
  "sources": [
    { "documentId": 5, "documentName": "relatorio.pdf", "excerpt": "...", "relevanceScore": 0.92 }
  ]
}
```

> **Nota:** o `SourceDetailResponse` já existe em `dto/response/SourceDetailResponse.java` com os campos corretos. Não precisa criar nada novo — basta usá-lo.

---

### Passo a passo — B5

#### B5.1 — Alterar `MessageResponse.java`

**Arquivo:** `src/main/java/com/plataforma/conversacional/dto/response/MessageResponse.java`

| Campo | Antes | Depois |
|---|---|---|
| `String metadata` | JSON string das fontes | Remover |
| `List<SourceDetailResponse> sources` | Ausente | Adicionar |

```java
// ANTES
public record MessageResponse(
    Long id, Long sessionId, String content,
    MessageRole role, MessageStatus status,
    String createdAt, String updatedAt,
    String metadata
) {}

// DEPOIS
public record MessageResponse(
    Long id, Long sessionId, String content,
    MessageRole role, MessageStatus status,
    String createdAt, String updatedAt,
    List<SourceDetailResponse> sources
) {}
```

**Import a adicionar:** `import java.util.List;`

---

#### B5.2 — Alterar `MessageServiceImpl.java` — método `send()`

**Arquivo:** `src/main/java/com/plataforma/conversacional/service/impl/MessageServiceImpl.java`

**O que muda:** em vez de serializar fontes para `metadata`, construir a lista de `SourceDetailResponse` e retornar a `MessageResponse` diretamente (sem passar pelo mapper).

Substituir o bloco atual (linhas 108–156) pelo seguinte fluxo:

```java
// 1. Executar RAG ou resposta simples (sem mudança)
String assistantContent;
List<SourceDetailResponse> sources;

if (hasIndexedDocuments) {
    RagResult result = ragPipeline.execute(request.content(), sessionId);
    assistantContent = result.answer();
    sources = result.sources().stream()
        .map(ref -> new SourceDetailResponse(
            ref.getChunk().getDocument().getId(),
            ref.getChunk().getDocument().getOriginalName(),
            ref.getExcerpt(),
            ref.getRelevanceScore()
        ))
        .toList();
} else {
    assistantContent = processingStrategy.process(request.content());
    sources = List.of();
}

// 2. Salvar mensagem (sem campo metadata)
Message assistantMessage = new Message();
assistantMessage.setSession(session);
assistantMessage.setContent(assistantContent);
assistantMessage.setRole(MessageRole.ASSISTANT);
assistantMessage.setStatus(MessageStatus.RECEIVED);
messageRepository.save(assistantMessage);

// 3. Salvar SourceReferences no banco (manter para auditoria)
if (!sources.isEmpty()) {
    // salvar sourceRefs como antes
}

eventPublisher.publishMessageSent(assistantMessage.getId(), hasIndexedDocuments ? "RAG" : "SIMPLE");

// 4. Retornar MessageResponse com sources estruturado
return new MessageResponse(
    assistantMessage.getId(),
    sessionId,
    assistantContent,
    assistantMessage.getRole(),
    assistantMessage.getStatus(),
    assistantMessage.getCreatedAt().toString(),
    assistantMessage.getUpdatedAt().toString(),
    sources
);
```

**Imports a adicionar:**
```java
import com.plataforma.conversacional.dto.response.SourceDetailResponse;
```

---

#### B5.3 — Alterar `MessageServiceImpl.java` — método `sendWithFiles()`

**Mesma lógica do B5.2.** O `sendWithFiles()` tem código duplicado de serialização de fontes para `metadata` (linhas 224–239). Aplicar a mesma substituição: construir `List<SourceDetailResponse>` e retornar `MessageResponse` diretamente.

---

#### B5.4 — Alterar `MessageServiceImpl.java` — método `getHistory()`

**Arquivo:** mesma classe, método `getHistory()` (linha 271)

**Problema:** quando o histórico é carregado, as mensagens são mapeadas via `messageMapper.toResponse()`. Com o novo `MessageResponse` sem `metadata`, as mensagens do assistente no histórico não terão `sources` — o campo sempre virá `null`.

**Solução:** para cada mensagem `ASSISTANT` no histórico, buscar as fontes via `SourceReferenceRepository.findByMessageId()` e montar o response manualmente.

```java
// Em getHistory(), substituir o mapeamento simples:
List<MessageResponse> messages = messagePage.getContent().stream()
    .map(msg -> {
        if (msg.getRole() == MessageRole.ASSISTANT) {
            List<SourceDetailResponse> sources = sourceReferenceRepository
                .findByMessageId(msg.getId())
                .stream()
                .map(ref -> new SourceDetailResponse(
                    ref.getChunk().getDocument().getId(),
                    ref.getChunk().getDocument().getOriginalName(),
                    ref.getExcerpt(),
                    ref.getRelevanceScore()
                ))
                .toList();
            return new MessageResponse(
                msg.getId(), msg.getSession().getId(),
                msg.getContent(), msg.getRole(), msg.getStatus(),
                msg.getCreatedAt().toString(), msg.getUpdatedAt().toString(),
                sources
            );
        }
        return new MessageResponse(
            msg.getId(), msg.getSession().getId(),
            msg.getContent(), msg.getRole(), msg.getStatus(),
            msg.getCreatedAt().toString(), msg.getUpdatedAt().toString(),
            List.of()
        );
    })
    .toList();
```

---

#### B5.5 — Atualizar `MessageMapper.java`

**Arquivo:** `src/main/java/com/plataforma/conversacional/mapper/MessageMapper.java`

O mapper MapStruct atualmente tenta mapear o campo `metadata` (que não existe mais no `MessageResponse`). Como após B5.2–B5.4 o mapper não é mais usado para montar responses com sources, há duas opções:

| Opção | Ação |
|---|---|
| Remover o mapper | Deletar `MessageMapper.java` se não for usado em nenhum outro lugar |
| Manter com ajuste | Remover o mapeamento de `metadata` e adicionar `sources` com valor padrão `List.of()` |

**Recomendação:** verificar se `MessageMapper` é injetado em outras classes além de `MessageServiceImpl`. Se for usado apenas lá, pode ser removido sem risco, pois todos os métodos agora montam o `MessageResponse` diretamente.

---

### Contrato da API após B5 — `POST /api/v1/sessions/{id}/messages`

**Request (sem mudança):**
```json
{ "content": "qual é a taxa de juros?" }
```

**Response com documentos indexados:**
```json
{
  "id": 10,
  "sessionId": 1,
  "content": "A taxa de juros é 12% ao ano, conforme o documento.",
  "role": "ASSISTANT",
  "status": "RECEIVED",
  "sources": [
    {
      "documentId": 5,
      "documentName": "relatorio.pdf",
      "excerpt": "A taxa de juros vigente é de 12% ao ano...",
      "relevanceScore": 0.92
    }
  ],
  "createdAt": "2026-06-28T10:00:00.000Z",
  "updatedAt": "2026-06-28T10:00:00.000Z"
}
```

**Response sem documentos indexados na sessão:**
```json
{
  "id": 11,
  "sessionId": 1,
  "content": "Respondendo com conhecimento geral do modelo.",
  "role": "ASSISTANT",
  "status": "RECEIVED",
  "sources": [],
  "createdAt": "2026-06-28T10:01:00.000Z",
  "updatedAt": "2026-06-28T10:01:00.000Z"
}
```

---

## ❌ B6 — Endpoint `GET /api/v1/documents/{id}/status`

### Diagnóstico

O `DocumentController` possui apenas dois endpoints:
- `POST /upload`
- `GET /{documentId}` — retorna o `DocumentResponse` completo

O endpoint `/status` não existe. É necessário para que o n8n verifique o estado da indexação sem precisar receber um payload complexo.

---

### Passo a passo — B6

#### B6.1 — Criar `DocumentStatusResponse.java`

**Arquivo a criar:** `src/main/java/com/plataforma/conversacional/dto/response/DocumentStatusResponse.java`

```java
package com.plataforma.conversacional.dto.response;

public record DocumentStatusResponse(
    Long documentId,
    String status,
    Integer chunksCount
) {}
```

---

#### B6.2 — Adicionar método à interface `DocumentService`

**Arquivo:** `src/main/java/com/plataforma/conversacional/service/DocumentService.java`

Adicionar:
```java
DocumentStatusResponse getStatus(Long documentId);
```

---

#### B6.3 — Implementar em `DocumentServiceImpl`

**Arquivo:** `src/main/java/com/plataforma/conversacional/service/impl/DocumentServiceImpl.java`

**Lógica:**
1. Verificar se o documento existe — lançar `ResourceNotFoundException` se não existir
2. Buscar o `PipelineJob` pelo `documentId` via `PipelineJobRepository.findByDocumentId()`
3. Se não houver job → status é `"UPLOADED"` e `chunksCount = 0`
4. Se houver job → retornar `job.getStatus().name()` e `job.getChunksCount()`

```java
@Override
public DocumentStatusResponse getStatus(Long documentId) {
    documentRepository.findById(documentId)
        .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));

    return pipelineJobRepository.findByDocumentId(documentId)
        .map(job -> new DocumentStatusResponse(
            documentId,
            job.getStatus().name(),
            job.getChunksCount()
        ))
        .orElse(new DocumentStatusResponse(documentId, "UPLOADED", 0));
}
```

**Dependência a injetar:** `PipelineJobRepository` (verificar se já está injetado em `DocumentServiceImpl`; se não, adicionar via construtor).

---

#### B6.4 — Adicionar endpoint ao `DocumentController`

**Arquivo:** `src/main/java/com/plataforma/conversacional/controller/DocumentController.java`

Adicionar após o `findById`:

```java
@GetMapping("/{" + DOCUMENT_ID_VARIABLE + "}/status")
public ResponseEntity<DocumentStatusResponse> getStatus(@PathVariable Long documentId) {
    DocumentStatusResponse response = documentService.getStatus(documentId);
    return ResponseEntity.ok(response);
}
```

**Import a adicionar:**
```java
import com.plataforma.conversacional.dto.response.DocumentStatusResponse;
```

---

### Especificação do endpoint após B6

| Campo | Valor |
|---|---|
| Método | `GET` |
| Rota | `/api/v1/documents/{id}/status` |
| Autenticação | Bearer JWT obrigatório |
| Response 200 | `{ "documentId": 5, "status": "READY", "chunksCount": 42 }` |
| Response 404 | `{ "status": 404, "message": "Document not found: 5" }` |

| `status` retornado | Significado |
|---|---|
| `UPLOADED` | Arquivo salvo, ingestão não iniciada |
| `QUEUED` | Job criado, aguardando processamento |
| `PARSING` | Extração de texto em andamento |
| `CHUNKING` | Fragmentação em andamento |
| `EMBEDDING` | Geração de vetores em andamento |
| `READY` | Indexação concluída |
| `FAILED` | Erro no pipeline |

---

## Checklist de Validação — Backend

### Itens já validados (concluídos)

- [x] Ollama acessível em `http://localhost:11434`
- [x] `POST /api/v1/rag/ingest/{documentId}` inicia pipeline e retorna `jobId`
- [x] `GET /api/v1/rag/ingest/{jobId}/status` retorna status QUEUED → READY
- [x] Pipeline processa PDF e TXT corretamente
- [x] Chunks e embeddings (dim=768) persistidos no banco
- [x] Busca vetorial por similaridade cosseno funcional
- [x] RAG integrado ao fluxo de `POST /api/v1/sessions/{id}/messages`
- [x] Webhook n8n disparado após ingestão (quando `app.n8n.enabled=true`)

### Itens pendentes (B5 e B6)

- [ ] `POST /api/v1/sessions/{id}/messages` retorna `sources: [...]` (não `metadata`)
- [ ] `GET /api/v1/sessions/{id}/messages` (histórico) retorna `sources` em cada mensagem ASSISTANT
- [ ] `sources` nunca é `null` — retornar `[]` quando sem documentos
- [ ] `GET /api/v1/documents/{id}/status` retorna `{ documentId, status, chunksCount }` — Response 200
- [ ] `GET /api/v1/documents/{id}/status` retorna 404 para documento inexistente
- [ ] `npm run build` no frontend sem erros após B5 (fontes aparecem no `SourcePanel`)

---

## Grafo de Dependências — Estado Atual

```
✅ B1 (Ollama Config)
   └── ✅ B2 (EmbeddingStrategy)
          ├── ✅ B3 (Pipeline Ingestão)
          │          └── ✅ B7 (Webhook n8n)
          └── ✅ B4 (RagPipeline + SimilarityRetriever)
                 └── ⚠️ B5 (sources no MessageResponse)  ← BLOQUEIA FRONTEND
                            └── ❌ B6 (status endpoint)  ← independente

✅ F1 (Timeout Axios)
✅ F2 (Leitura de sources)
✅ F3 (SourcePanel component)
✅ F4 (MessageBubble atualizado)
✅ F5 (Estado sem fontes)
```

**Ordem de execução das pendências:**

| Ordem | Tarefa | Quem | Impacto |
|---|---|---|---|
| 1 | B5.1 — Alterar `MessageResponse.java` | Backend | Desbloqueia frontend |
| 2 | B5.2 — Alterar `send()` em `MessageServiceImpl` | Backend | Core da mudança |
| 3 | B5.3 — Alterar `sendWithFiles()` | Backend | Consistência |
| 4 | B5.4 — Alterar `getHistory()` com sources | Backend | Histórico com fontes |
| 5 | B5.5 — Atualizar ou remover `MessageMapper` | Backend | Limpeza |
| 6 | B6.1 — Criar `DocumentStatusResponse` | Backend | Baixo impacto |
| 7 | B6.2 + B6.3 — Service + implementação | Backend | Baixo impacto |
| 8 | B6.4 — Endpoint no controller | Backend | Baixo impacto |

---

**Fim do Documento — Implementação Parte 2 RAG (revisão pós-análise)**
