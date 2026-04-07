# Agent instructions (AdminPanel)

This file is for humans and AI coding agents. Read it at the start of substantive work in this repository.

## Critical requirements (non-negotiable)

1. **Admin auth and access control**  
   Every route in the admin area must be behind **Google sign-in**. Only users whose row in `profiles` has **`is_superadmin = true`** may use the app.  
   Skipping this exposes the staging environment (and data) to the public internet.

2. **Supabase RLS**  
   Do **not** create, alter, enable, or disable **any RLS policies** in Supabase for this work. The existing database RLS stays as-is.

## Project snapshot

- **Purpose:** Next.js **admin panel** backed by an **existing** database (read/write as designed; schema owned elsewhere).
- **Status:** Next.js admin UI with Google auth, superadmin gate, dashboard, and CRUD for images (profiles/captions read as specified).

Update this section when the product direction and main user flows are clear.

## Tech stack

| Area | Choice | Notes |
|------|--------|--------|
| Framework | Next.js | Admin UI |
| Data / API | Existing DB + Supabase *(as used in repo)* | RLS is off-limits; see above |
| Auth | Google | Gated by `profiles.is_superadmin` |
| Language / runtime | TypeScript | App Router, `src/` |
| Package manager | npm | |
| Tests / CI | *TBD* | |

## Repository layout

| Path | Role |
|------|------|
| `src/app/admin/*` | Protected admin UI (layout enforces superadmin) |
| `src/app/login`, `src/app/auth/callback` | Google OAuth |
| `src/lib/supabase/*` | Browser + server + middleware Supabase clients |
| `src/lib/db/columns.ts` | Optional env overrides for nonstandard column names |
| `src/lib/stats.ts` | Dashboard aggregations |
| `.env.example` | Required public Supabase env vars (copy to `.env.local`) |

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Conventions for agents

- **Security:** See **Critical requirements** above on Google login, `profiles.is_superadmin`, and **no RLS changes** in Supabase.
- **Scope:** Change only what the task requires; avoid drive-by refactors or unrelated files.
- **Match the codebase:** Naming, types, imports, and patterns should match surrounding code.
- **Verify when possible:** Run test/lint/typecheck after non-trivial changes (when those exist).
- **Secrets:** Never commit API keys or production credentials. Use env vars; document them in `.env.example` when the app uses them.
- **Git:** Commit logical chunks of work with clear messages when a feature/fix is complete or at a stable milestone—especially before switching context or ending a session. Do not commit `.env*` or `node_modules`.

## Next.js note for agents

This project may use a newer Next.js than older training cutoffs. Prefer the installed package’s docs under `node_modules/next/dist/docs/` when APIs or conventions differ.

## Cursor-specific notes

- **Project rules:** Long-lived guidance can live in `.cursor/rules/` as `.mdc` files (see Cursor docs for frontmatter).
- **This file:** High-level context and human-edited conventions; keep it accurate and relatively short.

## Open questions

Track decisions not yet made (e.g. hosting, monorepo vs single package). Remove items once resolved.

---

*Last reviewed: 2026-04-07*
