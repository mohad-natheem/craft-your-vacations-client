<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Coding Conventions

## Navigation
- Always use `<Link>` from `next/link` for internal navigation. Never use bare `<a>` tags for routing.

## Images
- Always use `<Image>` from `next/image` instead of `<img>` tags.

## Styling
- Always use Tailwind CSS utility classes for styling. Avoid inline styles and custom CSS unless absolutely necessary.
- Before introducing any new color, typography, or other design tokens, check `global.css` first. Use the existing Tailwind utilities and CSS variables defined there rather than adding new ones.

## Components
- Before creating a new component, check the `components/` folder for an existing one that can be reused or extended.
- When building new components, make them reusable and place them in the `components/` folder.

---

# Project Architecture

## Stack
- **Next.js 16.2.2** — App Router. Middleware file is `proxy.ts` (not `middleware.ts`), exported function is `proxy` (not `middleware`). Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Auth0** (`@auth0/nextjs-auth0` v4) for authentication
- **TanStack React Query v5** for server state
- **Zustand v5** for client UI state
- **Axios** for browser-side HTTP (`lib/api.ts`)
- **Native fetch** (Next.js extended) for server-side HTTP (`lib/bff.ts`)

---

## Data Fetching Architecture

There are two separate HTTP layers. Never mix them up.

```
Browser
  ↓ lib/api.ts (axios, baseURL=/api)
Next.js API Route (app/api/...)
  ↓ lib/bff.ts (native fetch, hits .NET at localhost:5025)
.NET Backend
```

### Layer 1 — Browser → Next.js: `lib/api.ts`
- Used inside React components and hooks
- Always call via `api.get<T>()`, `api.post<T>()`, `api.put<T>()`, `api.patch<T>()`, `api.delete<T>()`
- Returns the response body directly as `T`
- Automatically redirects to `/login` on 401

### Layer 2 — Next.js → .NET: `lib/bff.ts`
- Used only inside Next.js route handlers (`app/api/**/route.ts`)
- Always call `bffFetch<T>(path, options)` — never call the .NET backend directly from components
- `isPublic: true` — skips auth check (use for publicly accessible endpoints)
- `isPublic: false` (default) — requires a valid Auth0 session; returns 401 if missing; attaches `Authorization: Bearer <token>` header automatically
- `cache` — defaults to `{ revalidate: 300 }` (Next.js ISR, 5 min). Override per route:
  - `{ revalidate: N }` — cache for N seconds (Next.js server cache)
  - `"no-store"` — never cache, always hit .NET fresh (use for user-specific data)
  - `"force-cache"` — cache indefinitely (use for static reference data)

### API Endpoints: `lib/endpoints.ts`
- All API call functions are defined here as named exports grouped by domain
- Always add new endpoint functions here, never inline `api.get(...)` calls directly in hooks or components
- Example: `destinationsApi.getAll()`, `destinationsApi.getById(id)`

### Query Keys: `lib/queryKeys.ts`
- All TanStack Query keys are defined here
- Use function-based keys for dynamic values:
  ```ts
  destinations: {
    all: () => ['destinations'],
    detail: (id: string) => ['destinations', 'detail', id],
  }
  ```
- Always namespace keys by domain (e.g. `['destinations', ...]`) so `invalidateQueries` can target the whole domain

### Custom Hooks: `hooks/`
- Every `useQuery` call lives in a dedicated hook file (e.g. `hooks/useDestinations.ts`)
- Hooks import from `lib/endpoints.ts` and `lib/queryKeys.ts` — never construct URLs or keys inline
- Always set a `staleTime` appropriate to how frequently the data changes

---

## Adding a New API Endpoint — Checklist

When adding a new data-fetching feature, follow this order:

1. **`app/api/<resource>/route.ts`** — create the Next.js route handler; call `bffFetch` with appropriate `isPublic` and `cache`
2. **`lib/endpoints.ts`** — add the client-side API function using `api.get/post/...`
3. **`lib/queryKeys.ts`** — add the query key(s) for the resource
4. **`hooks/use<Resource>.ts`** — create the React Query hook using the endpoint and query key
5. **Component** — consume the hook

---

## State Management

### Rule: Server state vs UI state

| Data | Where it lives |
|------|---------------|
| Anything from the .NET backend | TanStack React Query |
| Auth session / user profile | Auth0 (`useUser()`) |
| Theme (dark/light) | `next-themes` (`useTheme()`) |
| UI state shared across 2+ components | Zustand store (`stores/`) |
| UI state local to one component | `useState` |

### TanStack React Query
- For all data that comes from the API
- Never duplicate API data into Zustand or `useState`
- After a mutation (create/update/delete), invalidate the relevant query key: `queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() })`

### Zustand (`stores/`)
- One store per concern, not one store per screen
- Current stores:
  - `stores/useUIStore.ts` — app-wide UI (mobile menu open/closed)
- When to add a new store:
  - State is needed by 2 or more unrelated components/screens, OR
  - State must survive navigation (e.g. multi-step booking flow, active search filters)
- Keep stores minimal: state + actions only. Never store derived data (compute it in the component from store + query data)
- Future stores to add when the feature is built:
  - `stores/useSearchStore.ts` — search query and destination filters
  - `stores/useBookingStore.ts` — in-progress booking across multi-step flow

---

## Authentication

- Auth is handled by `@auth0/nextjs-auth0` v4
- `auth0.middleware(request)` runs in `proxy.ts` and handles all `/api/auth/*` routes (login, callback, logout)
- Server-side session check: `await auth0.getSession()` (in route handlers or server components)
- Client-side user: `useUser()` from `@auth0/nextjs-auth0/client`
- Auth0 client config: `lib/auth0.ts`
- Public routes that don't require login are listed in `proxy.ts`

---

## File Structure Reference

```
app/
  (auth)/           — Auth pages (no Navbar layout)
  (root)/           — Main app pages (with Navbar)
  api/              — Next.js route handlers (BFF entry points)
components/         — Reusable UI components
hooks/              — React Query hooks (one per resource)
lib/
  api.ts            — Axios client (browser → Next.js)
  bff.ts            — BFF fetcher (Next.js → .NET)
  auth0.ts          — Auth0 client instance
  endpoints.ts      — API call functions grouped by domain
  queryKeys.ts      — TanStack Query key factory
  utils.ts          — Shared utilities (cn, etc.)
stores/             — Zustand stores (one per concern)
proxy.ts            — Next.js middleware (route protection + Auth0)
```
