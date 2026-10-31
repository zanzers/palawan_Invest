# AI Tool Calling Foundation

**Version:** 1.2
**Architecture:** Next.js + TypeScript + Supabase + OpenAI

## 1. Project Objective

Build the foundation of an AI-powered real-estate platform, starting with an AI assistant that can understand user requests and interact with the application through controlled backend tools.

The first priority is to understand and implement **LLM Tool Calling** before introducing advanced agents, RAG, automation, or specialized AI workflows.

The application should be designed so that additional capabilities can be added without rebuilding the foundation.

## 2. Technology Stack

| Technology     | Purpose                                          |
| -------------- | ------------------------------------------------ |
| Next.js        | Frontend and backend application                 |
| TypeScript     | Application and backend programming language     |
| Supabase       | PostgreSQL database, authentication, and storage |
| OpenAI API     | LLM and tool-calling capabilities                |
| Zod            | Input and tool-argument validation               |
| Vercel         | Application deployment                           |
| Git and GitHub | Version control and collaboration                |

### Backend approach

We will use Next.js Route Handlers and server-side code for backend functionality.

We do not need FastAPI or a separate Python backend for the initial project.

Python may be introduced in a future project or as a separate service if we eventually need custom ML models, model training, or specialized Python-based processing.

## 3. Initial Architecture

```text
REAL ESTATE AI PLATFORM
│
├── NEXT.JS APPLICATION
│   │
│   ├── Frontend
│   │   ├── Dashboard
│   │   ├── AI Assistant
│   │   └── Listing Management
│   │
│   ├── Backend
│   │   ├── Route Handlers
│   │   ├── Authentication
│   │   ├── Business Logic
│   │   └── Database Services
│   │
│   └── AI Engineering
│       ├── OpenAI Client
│       ├── AI Orchestrator
│       ├── Tool Registry
│       ├── Tool Handlers
│       └── Conversation Manager
│
└── SUPABASE
    ├── PostgreSQL
    ├── Authentication
    └── Storage
```

### AI request flow

1. The user sends a message through the frontend.
2. Next.js receives the request through an API Route Handler.
3. The backend authenticates the user.
4. The AI orchestrator sends the conversation and available tool definitions to OpenAI.
5. The model decides whether it needs a tool.
6. The backend validates and executes the requested tool.
7. The tool result is returned to the model.
8. The model generates a response.
9. The frontend displays the response.

**Important:** The LLM does not directly access the database. It requests tools, and our backend controls their execution.

## 4. Development Milestones

### Milestone 1 — LLM API Integration

**Goal:** Establish communication between Next.js and OpenAI.

Topics:

* API credentials and environment variables
* OpenAI client initialization
* Sending messages
* Receiving model responses
* Understanding request and response structures
* Message roles
* Token usage
* API errors and error handling

**Completion criteria:**

* Next.js can send a message to OpenAI.
* The application receives and displays the response.
* API credentials remain server-side.

### Milestone 2 — First Tool Calling

**Goal:** Understand how the model requests application functions.

Our first tool will be:

`search_listings`

Topics:

* What tool calling is
* Tool definitions
* JSON Schema
* Tool parameters
* Sending tools to OpenAI
* Receiving tool-call requests
* Executing backend functions
* Returning tool results to the model
* Handling the final model response

Example request:

```json
{
  "name": "search_listings",
  "arguments": {
    "location": "Makati",
    "property_type": "Condominium"
  }
}
```

Our backend will validate the arguments, execute the search, and return the results.

**Completion criteria:**

* The model can request `search_listings`.
* Next.js can execute the corresponding function.
* The result is returned to the model.
* The model can explain the retrieved results to the user.

### Milestone 3 — Tool Registry

**Goal:** Build a reusable system for managing tools.

Topics:

* Centralized tool definitions
* Tool registration
* Tool-name-to-handler mapping
* Dynamic tool selection
* Argument validation using Zod
* Tool execution and error handling

Initial planned tools:

| Tool              | Purpose                    |
| ----------------- | -------------------------- |
| `search_listings` | Search property listings   |
| `get_listing`     | Retrieve listing details   |
| `create_listing`  | Create a listing           |
| `update_listing`  | Update listing information |
| `archive_listing` | Archive a listing          |

We will start with search and retrieval before introducing tools that modify data.

**Completion criteria:**

* Multiple tools can be registered.
* The orchestrator can identify and execute the requested tool.
* Invalid arguments and execution failures are handled safely.

### Milestone 4 — Supabase Integration

**Goal:** Connect the AI tools to the actual application database.

Topics:

* Creating a Supabase project
* Environment configuration
* PostgreSQL fundamentals
* Database schema design
* Supabase client setup
* Server-side database operations
* CRUD services
* Data validation
* Row Level Security (RLS)

Initial database entities will be designed around the real-estate domain, including projects, listings, property details, and related records.

**Completion criteria:**

* Next.js can securely communicate with Supabase.
* Listing tools can retrieve real database records.
* Backend services handle database operations.
* Database access follows the application's authorization rules.

### Milestone 5 — Conversation Management

**Goal:** Allow the assistant to maintain context across multiple messages.

Topics:

* Conversation persistence
* Message persistence
* Retrieving conversation history
* Sending conversation context to OpenAI
* Tool-call history
* Multiple tool calls
* Context-window management
* Error recovery

Proposed tables:

**conversations**

* id
* user_id
* title
* created_at
* updated_at

**messages**

* id
* conversation_id
* role
* content
* created_at

**tool_executions**

* id
* conversation_id
* message_id
* tool_name
* arguments
* execution_status
* result
* created_at

The exact schema will be finalized during implementation.

**Completion criteria:**

* Conversations and messages are saved.
* The assistant can retrieve previous messages.
* Tool calls and results are tracked.
* Multi-turn conversations work correctly.

### Milestone 6 — Security and Authorization

**Goal:** Ensure that AI tools cannot perform unauthorized operations.

Topics:

* Supabase Authentication
* User identity verification
* Server-side authorization
* Role-based permissions
* Supabase RLS
* Tool permission mapping
* Input validation
* Secure environment variables
* Execution logging
* Human approval for sensitive operations

Initial permission mapping:

| Tool              | Permission         |
| ----------------- | ------------------ |
| `search_listings` | `listings.read`    |
| `get_listing`     | `listings.read`    |
| `create_listing`  | `listings.create`  |
| `update_listing`  | `listings.update`  |
| `archive_listing` | `listings.archive` |

Important rules:

* The AI assistant does not automatically inherit administrator privileges.
* Every tool execution must respect the authenticated user's permissions.
* Sensitive changes should require user confirmation.
* Never allow arbitrary SQL execution through an LLM-generated request.
* Service-role credentials must never be exposed to the frontend.

**Completion criteria:**

* Users can only access authorized data.
* Tool execution checks permissions.
* Sensitive operations require appropriate confirmation.
* Errors and executions are logged.

## 5. Initial Project Folder Structure

We will build this incrementally rather than creating every folder immediately.

A possible target structure:

```text
src/
│
├── app/
│   └── api/
│       └── assistant/
│           └── route.ts
│
├── lib/
│   ├── openai/
│   │   └── client.ts
│   │
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   └── ai/
│       ├── orchestrator.ts
│       ├── registry.ts
│       ├── conversation.ts
│       │
│       └── tools/
│           ├── definitions/
│           └── handlers/
│
├── services/
│   └── listings/
│
└── types/
```

This is a target structure, not a requirement to create everything on day one.

## 6. Future Expansion — Not Part of the Initial Milestones

Once the foundation is stable, we can consider:

* RAG and semantic search
* Embeddings
* Advanced agent workflows
* AI listing descriptions
* Social media caption generation
* Poster generation
* Video generation
* Scheduled automation
* Specialized AI agents
* Custom ML services

These capabilities should be introduced when the application actually needs them.

## 7. Development Principles

1. Understand the underlying concepts before relying on abstractions.
2. Build incrementally and test each milestone.
3. Keep predictable business logic in normal TypeScript functions.
4. Use the LLM for language understanding, reasoning, and tool selection.
5. Keep database access under backend control.
6. Validate every tool argument.
7. Enforce authorization independently of the model.
8. Avoid unnecessary services and infrastructure.
9. Design for future expansion without implementing future requirements prematurely.

## 8. Initial Definition of Done

The initial AI Tool Calling foundation is complete when:

* The application communicates with OpenAI.
* The assistant can request registered tools.
* The backend validates and executes those tools.
* Tools can retrieve real-estate data from Supabase.
* Conversations persist across multiple messages.
* Tool executions are tracked.
* Authentication and authorization protect application data.

**Our immediate starting point is Milestone 1: LLM API Integration.**
