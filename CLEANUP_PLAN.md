# Cleanup & Implementation Plan — Ibn Al Arab

## Objective
Convert the repo to a clean Vite + React + TypeScript SPA using Supabase for auth and DB. Remove Builder.io / serverless remnants that break parsing and tooling.

## Phase 0 — Repo cleanup (priority)
1. Fix `vite.config.ts` typo (`stopimport` → `import`).
   - Acceptance: `pnpm typecheck` reports no parser errors.
2. Remove `pkg` object from package.json and uninstall `dotenv` if unused.
   - Acceptance: package.json cleaned; scripts still work.
3. Search and remove/archive builder/serverless files (builder.config.js, serverless.yml, vercel.json, dist/server/, functions/, public/_builder, @builder.io imports).
   - Acceptance: no serverless artifacts referenced.
4. Prune unused heavy dependencies (three.js, @react-three/*, vaul, txs, @swc/core, tsx) after verification.
   - Acceptance: `pnpm install` + `pnpm typecheck` pass.
5. Add `.env.example` documenting required env vars:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - EMAIL_SMTP_HOST / EMAIL_SMTP_USER / EMAIL_SMTP_PASS (or SENDGRID_API_KEY)

## Next phases (high-level)
- Phase 1: Supabase project & DB schema
- Phase 2: Email provider setup
- Phase 3: Frontend flows (landing, checkout, auth, profile, admin)
- Phase 4: Testing & deployment

## Acceptance Criteria (overall)
- `pnpm install` -> `pnpm typecheck` -> `pnpm dev` runs.
- User can register/login, place order, see order in profile.
- Admin can confirm orders and view metrics.
