[![CI](https://github.com/zanzers/palawan_Invest/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zanzers/palawan_Invest/actions/workflows/ci.yml)

# AI Tool Calling Foundation

**Version:** 1.3
**Product:** Palawan Home (rental, brokerage and project listings)
**Architecture:** Next.js + TypeScript + Supabase + a provider-agnostic LLM client (free models)

## 1. Project Objective

Build the foundation of an AI-powered real-estate platform, starting with an AI assistant that can understand requests and interact with the application through controlled backend tools.

The first priority was to understand and implement **LLM tool calling** before introducing advanced agents, RAG, automation, or specialized AI workflows. The foundation is now in place, and the product is being built on top of it.

### Product direction

| Audience | Experience |
| -------- | ---------- |
| **Public visitors** | Browse the catalog with manual search and filters, and contact the agent directly to request a viewing. No AI is required to use the public site. |
| **The agent** | A private dashboard with an AI assistant that creates and manages listings through validated tools, with human confirmation before any change. |

Design constraint: after launch the project uses **free tiers only** (hosting, database, and LLM). The app must keep working when the free LLM quota runs out, so the non-AI search path is a first-class feature.

## 2. Status at a Glance

| Milestone | Status |
| --------- | ------ |
| 1. LLM API integration | Done |
| 2. First tool calling | Done |
| 3. Tool registry | Done |
| 4. Supabase integration | Done |
| 5. Conversation management | Done |
| 6. Security and authorization | In progress |
| Agent dashboard (UI) | In progress (shell and bottom navigation) |
| Public catalog (UI) | Planned |

## 3. Technology Stack

| Technology | Purpose |
| ---------- | ------- |
| Next.js (App Router, Turbopack) | Frontend and backend application |
| TypeScript | Application and backend language |
| Tailwind CSS | Styling |
| Supabase | PostgreSQL, authentication, storage, Row Level Security |
| Any OpenAI-compatible API | LLM and tool calling, currently OpenRouter free models |
| Zod | Input and tool-argument validation |
| Phosphor Icons | Icons |
| GitHub Actions | Continuous integration |
| Vercel | Deployment (planned) |

### Backend approach

Next.js Route Handlers and server-side code provide the backend. There is no separate Python service. One may be added later only if custom ML processing is needed.

## 4. Architecture

```text
PALAWAN HOME
│
├── PUBLIC SIDE (planned)
│   ├── Catalog: manual search, filters, listing pages
│   ├── Viewing requests, with a notification to the agent
│   └── Optional rule-based chatbot (no LLM)
│
├── AGENT SIDE
│   ├── Dashboard (Home, Add, Contact)
│   └── AI assistant for creating and managing listings
│
├── NEXT.JS BACKEND (Route Handlers)
│   ├── POST /assistant   authenticated, rate limited, tool loop
│   └── GET  /listings    direct search, no AI
│
├── AI ENGINEERING
│   ├── LLM client: ordered targets with automatic fallback
│   ├── Tool registry: defineTool + Zod validation
│   ├── Tools: search_listings, get_listing
│   └── Conversation manager: history and tool log
│
└── SUPABASE
    ├── PostgreSQL with RLS
    ├── Authentication
    └── Storage (planned, for listing photos)
```

### AI request flow

1. The agent sends a message to `POST /assistant` with their Supabase access token.
2. The route validates the body and verifies the session.
3. `consume_request` enforces the per-user and global daily limits.
4. The last 10 messages of the conversation are loaded (RLS limits this to the owner).
5. The LLM client tries each configured target in order until one answers.
6. If the model requests a tool, the registry validates the arguments with Zod, runs the handler, and returns the result. This repeats for up to 4 steps, and an identical repeated call is blocked.
7. The final reply is returned, and the turn and every tool execution are saved.

**Important:** the LLM never accesses the database directly. It requests tools, and the backend controls their execution.

### Direct search (no AI)

`GET /listings?location=&type=&max_price=` validates its parameters with Zod and calls the same `searchListing` service the AI tool uses. The chat page falls back to it when the assistant returns 429, 502 or 503.

## 5. Configuration

Copy `.env.example` to `.env` and fill in the values. Never commit `.env`.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# LLM targets, tried in order (up to 5). Any OpenAI-compatible API works.
LLM_1_BASE_URL=https://openrouter.ai/api/v1
LLM_1_API_KEY=
LLM_1_MODEL=

LLM_2_BASE_URL=https://openrouter.ai/api/v1
LLM_2_API_KEY=
LLM_2_MODEL=

# Kill switch: /assistant returns 404 unless this is "true"
ASSISTANT_ENABLED=false
```

- Switching or adding a provider is an env change only. A target with a missing value is skipped.
- Free models are rotated or retired by their hosts without notice. If one stops working, copy a replacement ID from the provider's model page.
- The service-role key is not used anywhere in this project.

### Run locally

```bash
npm install
npm run dev
```

## 6. Database

| Table | Purpose |
| ----- | ------- |
| `listings` | Code, title, location, status, developer |
| `property_details` | Unit type, price, floor area and lot area for each listing |
| `property_specifications` | Key/value specifications for each unit |
| `developers` | Developer names |
| `conversations` | One row per assistant conversation, owned by a user |
| `messages` | User and assistant messages |
| `tool_executions` | Audit log of every tool call, with arguments, status and result |
| `usage_events` | Request counts behind the daily limits (no direct client access) |

Row Level Security is enabled on every table. Listing data is readable by the public (active listings only). Conversation data is readable and writable only by its owner. The `consume_request()` database function enforces the daily limits and has its limits fixed inside the function, so clients cannot change them.

## 7. Development Milestones

### Milestone 1: LLM API Integration (Done)

A provider-agnostic client built on the OpenAI SDK. Targets are configured through env variables and tried in order. A failed target (timeout, rate limit, retired model, empty response) falls through to the next, and only when all fail does the caller see an error. Credentials stay server-side.

### Milestone 2: First Tool Calling (Done)

`search_listings` is defined with a JSON Schema for the model and validated with Zod on the backend. The route runs the tool loop: model request, validation, execution, result returned, final answer.

### Milestone 3: Tool Registry (Done)

Tools are declared once with `defineTool` (name, description, JSON Schema, Zod schema, handler) and registered in a single list. The registry exposes tool definitions to the model and executes calls by name. Invalid arguments, unknown tools and thrown errors become safe error results.

| Tool | Purpose | Permission (planned) |
| ---- | ------- | -------------------- |
| `search_listings` | Search listings | `listings.read` |
| `get_listing` | Get one listing by code | `listings.read` |
| `create_listing` | Create a listing | `listings.create` |
| `update_listing` | Update a listing | `listings.update` |
| `archive_listing` | Archive a listing | `listings.archive` |

The first two are implemented. The write tools come after roles and confirmation exist.

### Milestone 4: Supabase Integration (Done)

A normalized schema with RLS read policies. The tools read real data through a service layer, and return only selected columns so private fields can never reach the model.

### Milestone 5: Conversation Management (Done)

Conversations, messages and tool executions are persisted per user. The last 10 user and assistant messages are replayed to the model. Tool results are deliberately not replayed, to save tokens on free models.

### Milestone 6: Security and Authorization (In progress)

Done:

- [x] Input validation with Zod on every route and tool
- [x] Server-side session verification
- [x] Row Level Security on every table
- [x] Per-user and global daily request limits
- [x] Execution logging in `tool_executions`
- [x] Service-role credentials never used or exposed
- [x] No arbitrary SQL from model output
- [x] Kill switch for the assistant route

Remaining:

- [ ] Agent login (accounts are created manually, with no public sign-up)
- [ ] Roles and a permission check in the tool registry
- [ ] Write tools with human confirmation
- [ ] Log who ran each tool, and whether it was allowed or denied

## 8. Project Structure

```text
src/
├── app/
│   ├── (agent)/
│   │   ├── auth/              login and sign-up (placeholders)
│   │   └── dashboard/         agent shell: Home, Add, Contact
│   ├── assistant/route.ts     POST /assistant
│   └── listings/route.ts      GET /listings
│
├── api/
│   ├── assistant/prompt.ts    system prompt and tool descriptions
│   └── schema/                Zod schemas for request bodies and filters
│
├── lib/
│   ├── ai/                    registry, tool types, tools/
│   ├── auth/                  session verification
│   ├── client_lib/            LLM client errors
│   ├── openai/client.ts       multi-target LLM client
│   ├── services/              listing helpers
│   └── supabase/              browser, server and user clients
│
├── services/
│   ├── listing/               listing search and lookup
│   ├── conversation/          history and persistence
│   └── usage/                 daily request limits
│
├── components/
│   ├── dashboard/             bottom navigation, page placeholders
│   └── ui/                    shared UI components
│
└── type/                      shared TypeScript types
```

## 9. Development Workflow

### Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`:

1. Install dependencies (`npm ci`)
2. Generate Next.js types
3. Type check (`tsc --noEmit`)
4. Lint with zero warnings allowed
5. Tests, when a test script exists
6. Production build, using dummy environment values

`main` is protected by a ruleset, so every change goes through a pull request.

### Shipping a change

```powershell
.\.scripts\ship.ps1 "feat: short description"
```

The script runs type generation, the type check and lint locally and stops on any problem. It then creates a branch from `main`, commits, pushes, opens a pull request, waits for CI, checks for conflicts, and asks before squash-merging. Commit messages follow the conventional style (`feat:`, `fix:`, `docs:`, `refactor:`).

## 10. Security Rules

- The AI assistant does not inherit administrator privileges.
- Every tool execution must respect the authenticated user's permissions.
- Sensitive changes require explicit user confirmation.
- Never allow arbitrary SQL through an LLM-generated request.
- Service-role credentials must never be exposed to the frontend.
- Free LLM endpoints may log prompts, so tools return only the fields that are safe to share, and no private client data is sent to a model.

## 11. Roadmap

Next steps, in order:

1. Agent dashboard: Home (listings, search, categories), Add listing (AI-assisted and manual), Contact.
2. Agent login, roles, and tool permissions.
3. Write tools (`create_listing`, `update_listing`, `archive_listing`) with a confirmation step.
4. Listing photos in Supabase Storage.
5. Public catalog: search, filters, listing detail pages.
6. Viewing requests with a notification to the agent.
7. Facebook Page posting: AI-written captions generated in batches, approved by the agent, then scheduled through the Graph API.
8. Optional rule-based chatbot for the public site.
9. Automated tests for the validation, registry and service layers.

Schema additions needed for the catalog design: a listing type (sale or rent), a category (rental, brokerage or project), and featured and recommended flags.

## 12. Development Principles

1. Understand the underlying concepts before relying on abstractions.
2. Build incrementally and test each milestone.
3. Keep predictable business logic in normal TypeScript functions.
4. Use the LLM for language understanding, reasoning, and tool selection.
5. Keep database access under backend control.
6. Validate every tool argument.
7. Enforce authorization independently of the model.
8. Degrade gracefully: the app must work when the AI is unavailable.
9. Avoid unnecessary services and infrastructure, and stay within free tiers.
10. Design for future expansion without implementing future requirements prematurely.

## 13. Definition of Done for the Foundation

- [x] The application communicates with an LLM through a provider-agnostic client.
- [x] The assistant can request registered tools.
- [x] The backend validates and executes those tools.
- [x] Tools retrieve real-estate data from Supabase.
- [x] Conversations persist across multiple messages.
- [x] Tool executions are tracked.
- [ ] Authentication and authorization protect all application data, including write operations.