# KRP-YAML Web

A single-page web application for browsing, searching, and editing classical Chinese texts in the [Kanripo](https://www.kanripo.org) corpus. It replaces the existing HXWD and Kanripo web interfaces.

Texts are stored in a custom YAML format. Users authenticate with GitHub and can clone texts, edit them in the browser, and submit pull requests back to the corpus.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Routing | TanStack Router (file-based, type-safe) |
| State | Zustand (persisted auth, text/search state) |
| Editors | CodeMirror 6 (YAML + Markdown modes) |
| GitHub API | Octokit REST |
| Auth | GitHub OAuth (Web Application Flow) |

CodeMirror is **code-split** — it only loads on the editor route, keeping the initial bundle small.

---

## Project structure

```
src/
├── api/
│   ├── types.ts          # All types derived from openapi.yaml
│   └── client.ts         # Typed fetch wrapper (search + passage)
├── stores/
│   ├── authStore.ts      # GitHub token + user, persisted to localStorage
│   └── textStore.ts      # Passage fetch, search, editor dirty state
├── lib/
│   └── github-oauth.ts   # OAuth URL builder + code→token exchange
├── hooks/
│   └── useGitHubLogin.ts # Redirect to GitHub, CSRF state management
├── components/
│   ├── layout/
│   │   └── AppShell.tsx  # Header with nav + auth button
│   └── editor/
│       ├── CodeMirrorEditor.tsx  # Base CM6 wrapper (controlled, sync-safe)
│       ├── YamlEditor.tsx        # YAML syntax + all base features
│       └── MarkdownEditor.tsx    # Markdown syntax
├── routes/               # File-based routes (auto-generates routeTree.gen.ts)
│   ├── __root.tsx        # Root layout (wraps AppShell)
│   ├── index.tsx         # / → SearchPage
│   ├── auth.callback.tsx # /auth/callback → OAuth exchange
│   └── texts/
│       ├── $textId.tsx        # /texts/:id → TextViewerPage
│       └── $textId.edit.tsx   # /texts/:id/edit → TextEditorPage (auth-gated)
└── pages/
    ├── SearchPage.tsx       # KWIC full-text search form + results
    ├── TextViewerPage.tsx   # Passage viewer
    ├── TextEditorPage.tsx   # YAML editor with GitHub save stub
    └── AuthCallbackPage.tsx # Handles GitHub OAuth redirect
```

---

## Backend API

The frontend talks to a Python backend (see `../krp-tools/api/`) via a proxied `/api/v1` path. The OpenAPI spec is at `../krp-tools/api/openapi.yaml`.

### Endpoints used

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/search` | KWIC full-text search across the corpus |
| `GET` | `/api/v1/passage` | Fetch and render a text passage |
| `POST` | `/api/auth/github/token` | Exchange OAuth code for access token (see below) |

### Passage response

The current API returns an `html` field (a rendered HTML fragment). The viewer renders this directly. Future work: return structured JSON so the frontend can control layout — important for vertical CJK text rendering via CSS `writing-mode: vertical-rl`.

---

## Getting started

### Prerequisites

- Node.js 20+
- The backend API running at `http://localhost:5000`

### 1. Install dependencies

```bash
npm install
```

### 2. Create a GitHub OAuth App

Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App** and fill in:

- **Application name**: KRP-YAML (dev)
- **Homepage URL**: `http://localhost:5173`
- **Authorization callback URL**: `http://localhost:5173/auth/callback`

Note the **Client ID** and generate a **Client Secret**.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

The **Client Secret** must never go in the frontend. Add it to the backend's environment instead (see below).

### 4. Add the token exchange endpoint to the backend

The backend needs one additional route to keep the client secret server-side:

```
POST /api/auth/github/token
Body: { "code": "<oauth_code>" }
Response: { "access_token": "<token>" }
```

It exchanges the code with GitHub using:

```
POST https://github.com/login/oauth/access_token
  client_id=...
  client_secret=...   ← stays on the server
  code=...
```

### 5. Start the dev server

```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

---

## Development commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Type-check + production build → dist/
npm run preview    # Serve the production build locally
npm run typecheck  # Type-check without building
npm run lint       # ESLint
```

---

## Routing

Routes are defined as files under `src/routes/`. TanStack Router's Vite plugin auto-generates `src/routeTree.gen.ts` at build time — **do not edit this file manually**.

| Route | Component | Notes |
|---|---|---|
| `/` | SearchPage | KWIC search |
| `/texts/:textId` | TextViewerPage | Passage viewer |
| `/texts/:textId/edit` | TextEditorPage | Requires GitHub login |
| `/auth/callback` | AuthCallbackPage | GitHub OAuth redirect target |

---

## Authentication flow

1. User clicks **Sign in with GitHub** → redirected to GitHub authorize URL (with a CSRF `state` token stored in `sessionStorage`)
2. GitHub redirects to `/auth/callback?code=xxx&state=yyy`
3. Frontend verifies `state`, POSTs `code` to `/api/auth/github/token`
4. Backend exchanges code → access token, returns it to the frontend
5. Frontend stores token in Zustand (persisted to `localStorage`) and fetches the user profile via Octokit

---

## Future work

- **GitHub edit flow**: load YAML from user's fork via Octokit, commit changes, open PR against `krp-yaml` org
- **Vertical text layout**: switch passage rendering to structured JSON and use `writing-mode: vertical-rl` for traditional column layout
- **Desktop app**: the Vite + React codebase wraps directly into [Tauri](https://tauri.app) with minimal changes
- **Pagination**: the search store already carries `offset`/`limit` — wire up UI controls
- **Markdown editor**: `MarkdownEditor` component is ready; needs a page/route for corpus documentation pages
