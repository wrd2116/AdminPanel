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
- **Status:** Greenfield / early — app structure and auth still to be implemented.

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

Document important paths here once they exist (e.g. `src/app/admin/`). Prefer a **single clear entrypoint** and conventional structure rather than premature abstraction.

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
