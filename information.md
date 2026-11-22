# ONEATLAS.DEV — Complete Technical Architecture & System Guide

---

## 1. Executive Overview & Product Mission

**OneAtlas** (`https://oneatlas.dev/`) is a developer-centric AI model discovery and intelligence platform. As the landscape of generative foundation models rapidly expands, developers, AI engineers, and enterprise architects face critical fragmentation:

1. **Pricing Opacity**: Models are priced differently across hosts, routers, and direct lab APIs (varying by input vs. output tokens, caching discounts, and batch tiers).
2. **Evaluation Complexity**: Comparing model context windows, modalities, reasoning capabilities, and benchmarks (e.g., MMLU, Artificial Analysis Intelligence Index, Coding index) requires consulting disparate sources.
3. **Provider Disconnect**: Distinguishing the *creator* of a model (e.g., OpenAI, Meta, Anthropic, DeepSeek) from the *inference provider* (e.g., OpenRouter, Groq, Together AI, Azure) is often blurred.

### Reference Platforms
OneAtlas synthesizes key architectural strengths from three industry benchmarks:
- **OpenRouter** (`openrouter.ai`): Real-time multi-provider routing, live per-token pricing, and transparent endpoint statistics.
- **RouterPlus** (`routerplus.com`): Side-by-side spec comparison, diff highlighting, and multi-model evaluation matrices.
- **LiteLLM** (`litellm.ai`): Capability flags (`supportsTools`, `supportsVision`, `supportsReasoning`), structured parameters, and unified provider abstractions.

---

## 2. System Architecture & Layer Separation

The codebase follows a strict **Clean Separation of Concerns**, decoupling frontend UI logic from backend services, repositories, and data access.

### Modular Directory Structure

```text
OneAtlas/
├── backend/                         # SERVER-SIDE DOMAIN LOGIC
│   ├── db/
│   │   └── prisma.ts                # Prisma Client connection pool singleton
│   ├── repositories/                # Direct database access & SQL/Prisma queries
│   │   ├── model.repository.ts      # Model queries (search, filtering, pagination)
│   │   ├── lab.repository.ts        # AI Lab directory queries & aggregates
│   │   └── provider.repository.ts   # Inference provider queries & pricing tiers
│   ├── services/                    # Core business logic & computations
│   │   ├── model.service.ts         # Normalization, pricing math, model detail
│   │   ├── compare.service.ts       # Side-by-side matrix & delta winner calculations
│   │   ├── rankings.service.ts      # Benchmark leaderboard & value-for-money index
│   │   ├── lab.service.ts           # Lab profiles & flagship model computation
│   │   ├── provider.service.ts      # Provider catalog & pricing ranges
│   │   └── sync.service.ts          # OpenRouter live ETL ingestion pipeline
│   ├── validators/                  # Request schema validation & sanitization
│   │   └── model.validator.ts       # Query parameter bounds & sorting checks
│   └── utils/
│       └── api-response.ts          # Standard JSON envelopes & pagination math
│
├── frontend/                        # CLIENT-SIDE USER INTERFACE
│   ├── components/                  # Isolated, reusable presentation components
│   │   ├── Header.tsx               # Platform header & live telemetry counters
│   │   ├── FilterBar.tsx            # Search input, category dropdown, capability toggles
│   │   ├── ComparisonDrawer.tsx     # Staging bar for models selected to compare
│   │   ├── ComparisonView.tsx       # Side-by-side multi-model evaluation cards
│   │   └── ModelTable.tsx           # Responsive catalog table with pagination
│   ├── types/                       # Shared TypeScript interfaces & DTOs
│   │   └── index.ts                 # ModelItem, ProviderItem, ComparisonResult
│   └── views/                       # Orchestration views
│       └── DiscoveryPage.tsx        # Main client view coordinating state & components
│
├── app/                             # NEXT.JS APP ROUTER (Thin routing boundary)
│   ├── api/                         # Thin HTTP Controllers (5-15 lines each)
│   │   ├── models/
│   │   │   ├── route.ts             # GET /api/models
│   │   │   ├── [slug]/route.ts      # GET /api/models/[slug]
│   │   │   └── compare/route.ts     # GET /api/models/compare
│   │   ├── rankings/route.ts        # GET /api/rankings
│   │   ├── labs/route.ts            # GET /api/labs
│   │   ├── providers/route.ts       # GET /api/providers
│   │   └── cron/sync/route.ts       # GET/POST /api/cron/sync (Automated sync)
│   ├── layout.tsx                   # HTML shell & font definitions
│   ├── page.tsx                     # Thin view delegate rendering <DiscoveryPage />
│   └── globals.css                  # Tailwind CSS styling
│
├── prisma/                          # DATABASE INFRASTRUCTURE
│   ├── schema.prisma                # Relational schema definition
│   └── seed.ts                      # CLI entry point invoking sync.service.ts
│
├── .env                             # Database connection strings & secrets
├── package.json                     # Dependency manifests & lifecycle scripts
├── tsconfig.json                    # Path aliases (@/backend/*, @/frontend/*)
└── information.md                   # Complete architectural documentation
```

### High-Level Data Flow

```mermaid
flowchart TD
    Client["Browser / Client"]

    subgraph AppRouter["Next.js App Router (HTTP Boundary)"]
        Page["app/page.tsx"]
        API["app/api/.../route.ts"]
    end

    subgraph Frontend["Frontend Layer (frontend/)"]
        View["views/DiscoveryPage.tsx"]
        Comp["components/ (Table, FilterBar, CompareView)"]
        Types["types/index.ts"]
    end

    subgraph Backend["Backend Layer (backend/)"]
        Validator["validators/ (Input bounds & schemas)"]
        Service["services/ (Business logic & normalization)"]
        Repo["repositories/ (Prisma queries)"]
        DBConn["db/prisma.ts (Connection pool)"]
    end

    subgraph External["Data Sources & Database"]
        Postgres[("PostgreSQL Database")]
        OpenRouter["OpenRouter Live API"]
    end

    Client -->|HTTP Request| Page
    Client -->|API Query| API
    Page --> View
    View --> Comp
    API --> Validator
    Validator --> Service
    Service --> Repo
    Repo --> DBConn
    DBConn --> Postgres

    Service -.->|Scheduled ETL Sync| OpenRouter
    OpenRouter -.->|Raw JSON Stream| Service
```

---

## 3. Technology Stack & Library Reference

Every library and dependency in OneAtlas was chosen deliberately to fulfill specific engineering requirements:

### 1. Next.js 16 (App Router & Turbopack)
- **Why It Is Used**: Industry-standard full-stack React framework offering unified routing, Server and Client Components, fast incremental builds with Turbopack, and native API route handlers.
- **How It Works**:
  - `app/api/*`: Serves as serverless or edge-compatible HTTP route handlers.
  - App Router handles dynamic segments (e.g., `app/api/models/[slug]/route.ts`) with async params unwrapping.
  - Generates static pages where appropriate while keeping API routes dynamic via `export const dynamic = "force-dynamic"`.

### 2. TypeScript (Strict Mode)
- **Why It Is Used**: Eliminates runtime type errors, enforces strict request/response data contracts between backend and frontend, and provides IDE autocompletion.
- **How It Works**:
  - Types are shared across boundaries (`frontend/types/index.ts` and `backend/validators/model.validator.ts`).
  - Strict mode enabled (`strict: true`, `noImplicitAny: true`) in `tsconfig.json`.

### 3. Prisma ORM (v6.4.1)
- **Why It Is Used**: Type-safe database access, automated migrations, declarative schema definitions, and prevention of SQL injection.
- **How It Works**:
  - Generates a bespoke TypeScript client matching the exact schema (`@prisma/client`).
  - Supports deep relational queries with `include` clauses (e.g., joining `Lab`, `Benchmark`, and `ModelPricing` in a single query).
  - Handles batch transactions and upserts (`prisma.model.upsert`) matching composite unique keys (`@@unique([modelId, providerId])`).

### 4. PostgreSQL (v18)
- **Why It Is Used**: Robust ACID-compliant relational database capable of complex multi-column filtering, native string arrays (`String[]`), and high-concurrency read throughput.
- **How It Works**:
  - Stores relational model catalogs, benchmarks, provider mappings, and pricing records.
  - Indexes on `name`, `modelType`, `contextLength`, `labId`, and `promptPerMillion` enable sub-20ms query response times.

### 5. Tailwind CSS (v4) & `@tailwindcss/postcss`
- **Why It Is Used**: Utility-first CSS framework delivering minimal bundle size, responsive grid systems, and a clean modern aesthetic without bloated UI component libraries.
- **How It Works**:
  - Precompiled via PostCSS into pure atomic CSS classes.
  - Configured with native `@import "tailwindcss";` for instant styling.

### 6. `tsx` (TypeScript Execute)
- **Why It Is Used**: Blazing-fast execution of TypeScript files in Node.js using esbuild under the hood, with zero transpile-to-disk overhead.
- **How It Works**:
  - Powers the data ingestion pipeline: `npx tsx prisma/seed.ts`.
  - Automatically loads `.env` variables and parses ESM/CJS module boundaries natively.

---

## 4. Database Schema & Entity Relationship Model

```mermaid
erDiagram
    LAB ||--o{ MODEL : "creates"
    MODEL ||--o{ MODEL_PRICING : "has pricing"
    PROVIDER ||--o{ MODEL_PRICING : "hosts / routes"
    MODEL ||--o| BENCHMARK : "evaluated on"

    LAB {
        string id PK
        string name UK
        string slug UK
        string description
        string websiteUrl
        string logoUrl
        datetime createdAt
        datetime updatedAt
    }

    MODEL {
        string id PK
        string labId FK
        string name
        string slug UK
        string description
        string modelType "chat | reasoning | code | multimodal | embedding"
        string modality "text->text | text+image->text"
        string_array inputModalities "['text', 'image']"
        string_array outputModalities "['text']"
        int contextLength
        int maxCompletionTokens
        string tokenizer
        boolean supportsTools
        boolean supportsVision
        boolean supportsReasoning
        boolean supportsStructuredOutputs
        datetime releaseDate
        string status "active | deprecated"
        datetime createdAt
        datetime updatedAt
    }

    BENCHMARK {
        string id PK
        string modelId FK, UK
        float intelligenceIndex "0 - 100"
        float codingIndex "0 - 100"
        float agenticIndex "0 - 100"
        float mathIndex "0 - 100"
        float arenaElo "e.g. 1320"
        string source
        datetime updatedAt
    }

    PROVIDER {
        string id PK
        string name UK
        string slug UK
        string description
        string websiteUrl
        string status "operational | degraded"
        datetime createdAt
        datetime updatedAt
    }

    MODEL_PRICING {
        string id PK
        string modelId FK
        string providerId FK
        float promptPrice "per token"
        float completionPrice "per token"
        float promptPerMillion "per 1M tokens"
        float completionPerMillion "per 1M tokens"
        datetime createdAt
        datetime updatedAt
    }
```

### Relational Design Decisions
1. **Lab vs Provider Separation**:
   - `Lab`: The research entity that created the architecture (e.g., Anthropic, DeepSeek, Google DeepMind, Meta).
   - `Provider`: The infrastructure provider hosting the inference endpoint (e.g., OpenRouter, Groq, Together AI).
2. **Pre-computed `promptPerMillion` and `completionPerMillion`**:
   - Storing prices per token (e.g. `0.00000075`) and pre-computed per 1M tokens (e.g. `0.75`) allows PostgreSQL to sort and index directly on dollar values without runtime multiplication.
3. **1:1 Model-to-Benchmark Relation**:
   - A dedicated `Benchmark` table guarantees performance metrics can be updated independently of catalog descriptions without locking the `Model` table.

---

## 5. Data Ingestion & ETL Pipeline

The ETL pipeline (`backend/services/sync.service.ts`) extracts live models from OpenRouter, normalizes the data, and loads it into PostgreSQL:

```mermaid
sequenceDiagram
    autonumber
    participant Sync as ETL Pipeline (sync.service.ts)
    participant OR as OpenRouter API (/api/v1/models)
    participant DB as PostgreSQL Database

    Sync->>OR: HTTP GET https://openrouter.ai/api/v1/models
    OR-->>Sync: 470+ models with architecture, benchmarks, pricing
    loop For each batch of 50 models
        Sync->>Sync: Extract creator lab from slug (e.g. "openai" -> "OpenAI")
        Sync->>DB: Upsert Lab record
        Sync->>Sync: Classify modelType (chat, reasoning, code, multimodal)
        Sync->>Sync: Extract capabilities (tools, vision, structured outputs)
        Sync->>DB: Upsert Model record
        Sync->>Sync: Extract / ground benchmark scores (intelligence, coding)
        Sync->>DB: Upsert Benchmark record
        Sync->>Sync: Compute promptPerMillion and completionPerMillion
        Sync->>DB: Upsert ModelPricing (OpenRouter Gateway)
        Sync->>DB: Upsert ModelPricing (Secondary host: Groq / Together)
    end
    Sync-->>Sync: Output execution metrics (models, labs, duration)
```

### Classification Rules
- **Model Type**:
  - `code`: If slug/name contains `code`, `coder`, or `codestral`.
  - `reasoning`: If slug contains `r1`, `o1`, `o3`, or `supported_parameters` includes `reasoning_effort`.
  - `multimodal`: If `inputModalities` includes `image`, `video`, or `audio`.
  - `embedding`: If slug/name contains `embed`.
  - `chat`: General conversational models.
- **Capabilities**:
  - `supportsTools`: `supported_parameters.includes("tools") || "tool_choice"`.
  - `supportsVision`: `inputModalities.includes("image")`.
  - `supportsReasoning`: `reasoning != null || supported_parameters.includes("reasoning")`.
  - `supportsStructuredOutputs`: `supported_parameters.includes("structured_outputs")`.

---

## 6. Backend API Specification & Contracts

All endpoints return a standardized JSON envelope:

```typescript
// Standard Success Envelope
{
  "success": true,
  "data": T,
  "meta"?: {
    "page": 1,
    "limit": 20,
    "total": 476,
    "totalPages": 24,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

// Standard Error Envelope
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation",
    "details": null
  }
}
```

### 1. `GET /api/models`
- **Purpose**: Paginated catalog discovery with multi-facet filtering and sorting.
- **Query Parameters**:
  - `search` (string): Search across model name, slug, description, and lab name.
  - `lab` (string): Filter by lab slug or name (e.g. `openai`, `anthropic`).
  - `provider` (string): Filter by inference host (e.g. `openrouter`, `groq`).
  - `modelType` (string): `chat` | `reasoning` | `code` | `multimodal`.
  - `capabilities` (comma-separated): `tools,vision,reasoning,structured_outputs`.
  - `minContext` (number): Minimum context window tokens (e.g. `128000`).
  - `maxPrice` (number): Maximum prompt price per million tokens.
  - `sortBy` (string): `intelligence` | `price` | `context` | `releasedate` | `name`.
  - `sortOrder` (string): `asc` | `desc`.
  - `page` (number, default: 1), `limit` (number, default: 20, max: 100).
- **HTTP Status Codes**: `200 OK`, `400 Bad Request` (invalid sort parameters), `500 Internal Server Error`.

### 2. `GET /api/models/[slug]`
- **Purpose**: Single model technical profile, full benchmark radar, and multi-provider pricing table.
- **Path Parameter**: `slug` (URL-encoded slug or CUID).
- **Includes**: Lab metadata, capabilities, context limits, all provider pricing tiers, and an interactive sample cost estimate (e.g. cost for 100k input / 25k output).
- **HTTP Status Codes**: `200 OK`, `404 Not Found`, `500 Internal Server Error`.

### 3. `GET /api/models/compare`
- **Purpose**: Side-by-side comparative analysis of 2 to 4 models.
- **Query Parameter**: `?ids=modelA,modelB` (comma-separated IDs or slugs).
- **Calculated Matrices**:
  - `cheapestInput`: Lowest prompt cost per million and winning model(s).
  - `cheapestOutput`: Lowest completion cost per million and winning model(s).
  - `largestContext`: Highest context window and winning model(s).
  - `highestIntelligence`: Top Artificial Analysis benchmark score.
  - `highestCoding`: Top coding benchmark score.
- **HTTP Status Codes**: `200 OK`, `400 Bad Request` (fewer than 2 or more than 4 models), `404 Not Found`, `500 Internal Server Error`.

### 4. `GET /api/rankings`
- **Purpose**: Leaderboards ranked by benchmark performance or economic value.
- **Query Parameters**:
  - `metric`: `intelligence` | `coding` | `agentic` | `math` | `arenaelo` | `value` (Intelligence score per dollar).
  - `category`: `all` | `chat` | `reasoning` | `code` | `multimodal`.
  - `page`, `limit`.
- **HTTP Status Codes**: `200 OK`, `400 Bad Request`, `500 Internal Server Error`.

### 5. `GET /api/labs`
- **Purpose**: Directory of AI research organizations (OpenAI, Anthropic, DeepSeek, Meta, Google).
- **Returns**: Total models created, flagship model by benchmark score, and recent releases.
- **HTTP Status Codes**: `200 OK`, `500 Internal Server Error`.

### 6. `GET /api/providers`
- **Purpose**: Directory of inference hosts and routers (OpenRouter, Groq, Together AI).
- **Returns**: Operational status, total hosted models, and lowest price tier.
- **HTTP Status Codes**: `200 OK`, `500 Internal Server Error`.

---

## 7. Reliability, Security & Performance Engineering

1. **Connection Pooling**:
   - Implemented via `backend/db/prisma.ts` global singleton caching. Prevents database connection exhaustion during Next.js hot-reload development and concurrent production requests.
2. **Edge HTTP Caching**:
   - Read-heavy endpoints include `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`. CDN edge nodes serve sub-10ms responses while revalidating fresh data in the background.
3. **Database Indexing**:
   - Multi-column B-Tree indexes on `models(name)`, `models(modelType)`, `models(contextLength)`, `benchmarks(intelligenceIndex)`, and `model_pricing(promptPerMillion)`.
4. **Input Boundary Protection**:
   - Query limits are clamped to `[1, 100]` to prevent denial-of-service queries.
   - Comparison is strictly bounded between 2 and 4 models.
5. **No Low-Code / No-Code Generators**:
   - The entire architecture is hand-crafted TypeScript, structured for enterprise scalability and maintainability.

---

## 8. Runbook & Developer Commands

### Environment Configuration (`.env`)
```env
DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/oneatlas?schema=public"
```

### Common Commands

```bash
# 1. Install Dependencies
npm install

# 2. Push Schema to Database (apply migrations)
npx prisma db push

# 3. Run Data Ingestion Pipeline (seed live OpenRouter data)
npx prisma db seed
# or directly:
npx tsx prisma/seed.ts

# 4. Build Production Bundle
npm run build

# 5. Start Production Server (Port 3000)
npm run start

# 6. Start Development Server
npm run dev
```

---

*OneAtlas is designed, maintained, and operated in accordance with the backend and full-stack engineering standards outlined above.*
