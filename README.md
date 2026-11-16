[![CI](https://github.com/zanzers/palawan_Invest/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zanzers/palawan_Invest/actions/workflows/ci.yml)

# AI Tool Calling Foundation

**Version:** 1.4
**Product:** PalHome, rental, brokerage and project listings in Palawan
**Architecture:** Next.js + TypeScript + Supabase + a provider-agnostic LLM client (free models)

## 1. Project Objective

Build the foundation of an AI-powered real-estate platform, starting with an AI assistant that can understand requests and act on the application only through controlled backend tools.

The foundation (LLM client, tool calling, tool registry, database, conversations) is complete. The product is now being built on top of it: an agent dashboard where listings are created with a map pin and photos, and later a public catalog.

### Product direction

| Audience | Experience |
| -------- | ---------- |
| **Public visitors** | Browse the catalog with manual search and filters, and profile the agent to request a viewing. No AI is needed to use the public site. |
| **The agent** | A private dashboard to create and manage listings, with an AI assistant that works through validated tools and asks for confirmation before changing data. |

Design constraint: after launch the project uses **free tiers only** (hosting, database, storage and LLM). The app must keep working when the free LLM quota runs out, so non-AI paths (search, forms) are first-class features.

## 2. Status at a Glance

| Area | Status |
| ---- | ------ |
| 1. LLM API integration | Done |
| 2. First tool calling | Done |
| 3. Tool registry | Done |
| 4. Supabase integration | Done |
| 5. Conversation management | Done |
| 6. Security and authorization | In progress |
| Agent dashboard: Home, Add listing, listing detail | In progress |
| Agent dashboard: profile, Inbox, Notifications | Placeholders |
| Deployment (Vercel, continuous deployment) | Next |
| Public site (catalog, visit requests) | Planned |

## 3. Technology Stack

| Technology | Purpose |
| ---------- | ------- |
| Next.js (App Router, Turbopack) | Frontend and backend application |
| TypeScript | Application and backend language |
| Tailwind CSS | Styling |
| Supabase | PostgreSQL, authentication, Storage, Row Level Security |
| Any OpenAI-compatible API | LLM and tool calling, currently OpenRouter free models |
| Zod | Input and tool-argument validation |
| Leaflet and OpenStreetMap | Map pin picker and listing map |
| Nominatim | Reverse geocoding (address from a map pin) |
| Phosphor Icons | Icons |
| GitHub Actions | Continuous integration |
| Vercel | Deployment (next) |

### Backend approach

Next.js Route Handlers and server-side code provide the backend. Multi-table writes run inside PostgreSQL functions so they are atomic. There is no separate Python service.

## 4. Architecture

```text
PALHOME
│
├── AGENT SIDE
│   ├── Login (email and password, accounts created by hand)
│   ├── Dashboard: Home, Add, profile, Inbox, Notifications
│   │   ├── Home: search, filters, Featured row
│   │   ├── Add: form, map pin, photos, preview, create
│   │   └── Listing detail: photos, price, details, amenities, map
│   └── AI assistant (tool calling, daily limits, kill switch)
│
├── PUBLIC SIDE (planned)
│   ├── Catalog and listing pages
│   ├── Visit requests with a notification to the agent
│   └── Optional rule-based chatbot (no LLM)
│
├── NEXT.JS BACKEND (Route Handlers)
│   ├── POST /assistant                          AI assistant
│   ├── GET  /listings                           direct search, no AI
│   ├── POST /listings                           create a listing (admin only)
│   ├── POST /api/listings/[listingId]/images    upload one photo (owner only)
│   └── GET  /api/reverse-geocode                address from coordinates
│
├── AI ENGINEERING
│   ├── LLM client: ordered targets with automatic fallback
│   ├── Tool registry: defineTool + Zod validation
│   ├── Tools: search_listings, get_listing
│   └── Conversation manager: history and tool log
│
└── SUPABASE
    ├── PostgreSQL with RLS and database functions
    ├── Authentication
    └── Storage (listing photos)
```

### AI request flow

1. The agent sends a message to `POST /assistant` with their Supabase access token.
2. The route validates the body and verifies the session.
3. `consume_request` enforces the per-user and global daily limits.
4. The last 10 messages of the conversation are loaded (RLS limits this to the owner).
5. The LLM client tries each configured target in order until one answers.
6. If the model requests a tool, the registry validates the arguments with Zod, runs the handler, and returns the result. This repeats for up to 4 steps, and an identical repeated call is blocked.
7. The reply is returned, and the turn and every tool execution are saved.

**Important:** the LLM never accesses the database directly. It requests tools, and the backend controls their execution.

### Creating a listing

1. The agent fills the form, taps the map to drop a pin, and adds photos.
2. The browser reverse-geocodes the pin through `/api/reverse-geocode` and fills in the display address.
3. The preview screen shows what will be saved.
4. `POST /listings` validates the payload with Zod and calls the `create_listing` database function. The function checks `is_admin()` and writes the listing, its details, its location and its specifications in one transaction.
5. Photos are resized in the browser (about 1600 px, WebP) and uploaded one at a time to `POST /api/listings/[listingId]/images`, with per-photo progress. A failed photo can be retried without recreating the listing.

### Direct search (no AI)

`GET /listings?location=&type=&max_price=` validates its parameters with Zod and reads the same service layer the AI tool uses. It is the fallback when the assistant is unavailable.

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

- Switching or adding an LLM provider is an env change only. A target with a missing value is skipped.
- Free models are rotated or retired by their hosts without notice. If one stops working, copy a replacement ID from the provider's model page.
- The Supabase service-role key is not used anywhere in this project.

### Run locally

```bash
npm install
npm run dev
```

### Admin account

Agent accounts are created by hand in Supabase (Authentication, Users), then added to the admin list:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'agent@example.com';
```

There is no public sign-up.

## 6. Database

| Table | Purpose |
| ----- | ------- |
| `listings` | Code, title, description, status, created_by, developer |
| `property_details` | Unit type, price, floor area and lot area of each listing |
| `locations` | Display address, latitude and longitude of each unit |
| `property_specifications` | Key/value specifications (bedrooms, bathrooms, one row per amenity) |
| `images` | Photo storage path and position for each listing |
| `developers` | Developer names |
| `user_roles` | Which accounts are admins |
| `conversations`, `messages` | Assistant conversations, owned by a user |
| `tool_executions` | Audit log of every tool call, with arguments, status and result |
| `usage_events` | Request counts behind the daily limits (no direct client access) |

Database functions:

| Function | Purpose |
| -------- | ------- |
| `is_admin()` | True when the caller is in `user_roles` |
| `create_listing(payload)` | Admin-only. Writes a listing and its related rows in one transaction |
| `consume_request()` | Enforces the per-user and global daily limits (limits fixed inside the function) |

Notes:

- Row Level Security is enabled on every table. Active listings are publicly readable. Conversation data is readable only by its owner. Listing writes go through `create_listing` rather than direct inserts.
- A unit can have only one value per specification (one `bedrooms`), except `amenities`, which has many rows and no duplicates.
- Photos live in a public Storage bucket. Only admins can upload or remove objects.

## 7. Development Milestones

### Milestone 1: LLM API Integration (Done)

A provider-agnostic client built on the OpenAI SDK. Targets come from env variables and are tried in order. A failed target (timeout, rate limit, retired model, empty response) falls through to the next, and only when all fail does the caller see an error. Credentials stay server-side.

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

The first two are implemented. The write tools come after tool permissions and confirmation exist. Listings can already be created through the dashboard form.

### Milestone 4: Supabase Integration (Done)

A normalized schema with RLS. The tools read real data through a service layer and return only selected columns, so private fields cannot reach the model.

### Milestone 5: Conversation Management (Done)

Conversations, messages and tool executions are persisted per user. The last 10 user and assistant messages are replayed to the model. Tool results are deliberately not replayed, to save tokens on free models.

### Milestone 6: Security and Authorization (In progress)

Done:

- [x] Input validation with Zod on routes and tools
- [x] Server-side session verification
- [x] Row Level Security on every table
- [x] Per-user and global daily request limits
- [x] Execution logging in `tool_executions`
- [x] Service-role key never used or exposed
- [x] No arbitrary SQL from model output
- [x] Kill switch for the assistant route
- [x] Agent login (email and password, manual accounts)
- [x] Admin role (`user_roles`, `is_admin()`)
- [x] Admin-only listing creation and photo upload

Remaining:

- [ ] Restrict `/assistant` to admins
- [ ] Permission check inside the tool registry
- [ ] Write tools with human confirmation
- [ ] Edit and archive endpoints, with admin and ownership checks
- [ ] Log who ran each tool and whether it was allowed or denied
- [ ] Server-side guard for dashboard pages
- [ ] Turn off anonymous sign-ins once the assistant is admin-only

## 8. Project Structure

```text
src/
├── app/
│   ├── (agent)/
│   │   ├── auth/                  login (sign-up is a placeholder)
│   │   └── dashboard/             Home, add, view/[listingId], profile, inbox, notifications
│   ├── api/
│   │   ├── listings/[listingId]/images/   photo upload
│   │   ├── reverse-geocode/               address lookup
│   │   ├── assistant/                     system prompt and tool descriptions
│   │   └── schema/                        Zod schemas
│   ├── assistant/route.ts     POST /assistant
│   ├── listings/route.ts      GET and POST /listings
│   └── config/                filter options
│
├── components/
│   ├── dashboard/             navigation, search, filters, create form parts
│   ├── ListingCards/          cards, rows, skeletons
│   └── ListingDetails/        gallery and property info
│
├── lib/
│   ├── ai/                    registry, tool types, tools/
│   ├── auth/                  session verification
│   ├── openai/                multi-target LLM client
│   ├── supabase/              browser, server, user and upload helpers
│   ├── map/                   map components and address lookup
│   └── format/                price formatting
│
├── services/
│   ├── listing/               listing queries
│   ├── conversation/          history and persistence
│   └── usage/                 daily request limits
│
├── utils/                     upload checks, image resizing, save hook
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
- Hiding a button is not security: every write is checked on the server and in the database.
- Free LLM endpoints may log prompts, so tools return only fields that are safe to share, and no private client data is sent to a model.

## 11. Design Principles in Practice

- **Dependency inversion:** the assistant route depends on `createChatCompletion`, `executeTool` and `getToolDefinitions`, not on a specific provider or tool. Upload helpers receive their database client as a parameter.
- **Open for extension:** a new tool is one `defineTool` call plus one line in the registry. A new LLM provider is a set of env variables.
- **Single responsibility:** authentication, rate limiting, validation, persistence and tool execution are separate modules.
- **Graceful degradation:** direct search and the manual create form work when the AI is unavailable.

## 12. Before the First Deployment

- [ ] Delete `src/app/debug-tool/route.ts`.
- [ ] Set environment variables in the host's settings (never in the repo).
- [ ] Keep `ASSISTANT_ENABLED` off in production until the assistant is admin-only.
- [ ] Turn off anonymous sign-ins in Supabase if nothing needs them.
- [ ] Confirm RLS is enabled on every table and that no service-role key is used.
- [ ] Check that the Storage bucket is public for reads and admin-only for writes.
- [ ] Move the geocoder profile address out of the source code and into an environment variable.
- [ ] Check the free-tier terms of the host and of Supabase (commercial use, project pausing).

## 13. Known Issues and Technical Debt

Some code is temporary and will be refactored after the first deployment.

- Property types are listed in more than one place and should come from a single list.
- Some unused schema files from an earlier design remain and should be deleted.
- `/api/reverse-geocode` is public and calls Nominatim, which allows about one request per second and asks for a real profile. It should require a session and be rate limited.
- The Home cards do not show cover photos yet.
- `search_listings`, `get_listing` and `GET /listings` must be kept in step with the normalized schema (the address now lives in `locations`).
- Dashboard pages are not yet guarded on the server. Writes are protected, reads of public data are not.
- The profile, Inbox and Notifications pages are placeholders.
- Only one unit per listing is supported. Several units for the project category are planned.

## 14. Roadmap

1. **Deploy** to the host and enable continuous deployment, then fix what the deployed environment reveals.
2. **Listing detail:** finish the page, then wire edit and archive with admin and ownership checks.
3. **Cover photos** on the Home cards.
4. **AI-assisted creation:** paste a description, let the LLM fill the form, fall back to manual entry when the quota is used up.
5. **Admin-only assistant**, tool permissions, and write tools with a confirmation step.
6. **Home sections:** Recommended, Brokerage and Rental, plus category tabs. This needs a listing type (sale or rent), a category, and featured and recommended flags.
7. **Public site:** catalog and listing pages, "profile" and "Schedule a visit", with a notification to the agent.
8. **Facebook Page posting:** AI-written captions generated in batches, approved by the agent, then scheduled through the Graph API.
9. Optional rule-based chatbot for the public site.
10. Automated tests for validation, the registry and the service layer.

## 15. Development Principles

1. Understand the underlying concepts before relying on abstractions.
2. Build incrementally and test each milestone.
3. Keep predictable business logic in normal TypeScript functions.
4. Use the LLM for language understanding, reasoning, and tool selection.
5. Keep database access under backend control.
6. Validate every input and tool argument.
7. Enforce authorization independently of the model.
8. Degrade gracefully: the app must work when the AI is unavailable.
9. Avoid unnecessary services and infrastructure, and stay within free tiers.
10. Design for future expansion without implementing future requirements prematurely.

## 16. Definition of Done for the Foundation

- [x] The application communicates with an LLM through a provider-agnostic client.
- [x] The assistant can request registered tools.
- [x] The backend validates and executes those tools.
- [x] Tools retrieve real-estate data from Supabase.
- [x] Conversations persist across multiple messages.
- [x] Tool executions are tracked.
- [ ] Authentication and authorization protect all application data, including every write the AI can perform.