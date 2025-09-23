# MASTER_PLAN — Ibn Al Arab

This file is the canonical master plan for ongoing work. It collects the authoritative spec → plan → tasks artifacts, summarizes current progress, and defines the immediate next actions. Save this as the single source of truth for long-run work and reference it before making broad changes.

---

## 1) Read-order (canonical)
Read these in this order for any major implementation work:
1. `specs/001-initial-build/spec.md`
2. `specs/001-initial-build/plan.md`
3. `specs/001-initial-build/tasks.md`
4. `specs/002-rebuild-app-spec/spec.md` (note: empty in repo)
5. `specs/002-rebuild-app-spec/plan.md`
6. `specs/002-rebuild-app-spec/tasks.md`
7. Supporting developer notes: `CLEANUP_PLAN.md`, `wierd problem.md` (context only)

Follow the Global Practices (`.github/instructions/Global practices.instructions.md`) while working: use separate terminals for servers, don't run long blocking commands in the foreground of your only terminal, and keep a saved master plan before starting long runs.

---

## 2) Core product objectives (short)
- Subscription-only weekly meal delivery. Plans are the product.
- Wire transfer is the initial payment method; card is "coming soon".
- Checkout must create a `subscription` (status `pending`) when proof is uploaded; admin approves to set `active`.
- RLS and Supabase service-role usage must protect writes; server-side upserts must create `profiles` rows on registration.
- Localization: default `ar` with RTL support.

---

## 3) Current mapped progress (state as of this save)
- Client edits: `client/pages/Checkout.tsx` updated to call `POST /api/subscriptions` before navigating to `/order-success`. (Source changed)
- New backend source: `backend/src/api/subscriptions.ts` added and `backend/server.ts` updated to mount it. (Source changed)
- Build status: `dist/spa` (client) exists. `dist/backend` was not rebuilt after adding `subscriptions.ts` so the running compiled server does not yet expose `/api/subscriptions`.
- Build tool note: `tsc` was not on PATH in the environment where a manual build was attempted; package.json includes `typescript` as a devDependency so `npm ci` or `pnpm install` (or `npx tsc`) should make the compiler available.

---

## 4) Canonical task list (T001–T025)

Below are the explicit, actionable tasks taken directly from `specs/001-initial-build/tasks.md`. Each task includes a short acceptance criteria and the current observed status in the repo.

- T001 — Setup: repo bootstrap and lint
  - Acceptance: `npm ci` runs; `npm run lint` exists.
  - Status: not-started

- T002 [P] — Add project testing skeleton (vitest)
  - Acceptance: `npm test` runs and returns 0 when no tests fail.
  - Status: not-started

- T003 [P] — Create failing contract tests for `GET /plans`
  - Acceptance: contract test exists and fails until endpoint implemented.
  - Status: done (contract present; endpoint implemented and passes)

- T004 [P] — Create failing contract test for `POST /checkout`
  - Acceptance: test present and fails initially.
  - Status: done (contract test added and now passes)

- T005 [P] — Create model tests for `plans` entity
  - Acceptance: tests present and fail until model implemented.
  - Status: completed

- T006 [P] — Create model tests for `profiles`, `addresses`, `subscriptions`, `payments`
  - Acceptance: tests present and fail until models implemented.
  - Status: completed

- T007 — Implement `plans` model and DB migration
  - Acceptance: model compiles and migration template exists.
  - Status: not-started

- T008 — Implement `profiles` and `addresses` models and migrations
  - Acceptance: models compile; `profiles` upsert endpoint exists and tests pass.
  - Status: in-progress (server-side `profiles` upsert handler exists; integration tests pending)

- T009 — Implement `subscriptions` and `payments` models and migrations
  - Acceptance: subscription/payment models exist and compile.
  - Status: in-progress (`backend/src/api/subscriptions.ts` source added; `dist` not rebuilt yet)

- T010 [P] — Add DB connection and simple seed for delivery districts (no prices)
  - Acceptance: seed file present and can be applied locally.
  - Status: not-started

- T011 — Implement `GET /plans` endpoint
  - Acceptance: contract test passes and `GET /api/plans` returns correct shape.
  - Status: done (endpoint returns JSON via backend/proxy)

- T012 — Implement `POST /checkout` endpoint (create checkout record placeholder)
  - Acceptance: `POST /checkout` validates `planId` and `addressId` and returns `checkoutId`.
  - Status: done (endpoint implemented at `/api/checkout`; contract test passes)

- T013 [P] — Implement upload handling (private storage) with signed URL generation stub
  - Acceptance: file upload uses local filesystem adapter in tests and path conventions validated.
  - Status: partial

- T014 — Implement wire-transfer flow: client files + server processing
  - Acceptance: proof upload creates `payments` row and `subscription` remains `pending`.
  - Status: in-progress (client updates applied; server-side endpoints exist but require compiled server and tests)

- T015 — Admin: review payments UI & endpoints (approve/reject)
  - Acceptance: admin endpoint approves and sets `subscription.status` to `active`.
  - Status: not-started

- T016 — Add RLS policies and tests for `profiles`, `subscriptions`, `payments`
  - Acceptance: RLS policies deny unauthorized access; tests validate enforcement.
  - Status: not-started

- T017 — Implement internationalization support (ar/en) in UI
  - Acceptance: default locale `ar` is used and `dir` toggles correctly.
  - Status: partially done (i18n strings present; further testing required)

- T018 — Implement MealsGallery and MealPlanPreview components (tests-first)
  - Acceptance: component tests pass and keyboard/accessibility respected.
  - Status: in-progress (components present; tests not exhaustive)

- T019 — Implement checkout total calculation guard & config error state
  - Acceptance: missing pricing config disables checkout and shows config-warning.
  - Status: not-started

- T020 — Accessibility and keyboard navigation testing for main page and gallery
  - Acceptance: accessibility tests pass or report issues.
  - Status: not-started

- T021 — Add contract tests for admin payment approval endpoint
  - Acceptance: contract tests pass.
  - Status: not-started

- T022 — Performance & load smoke test (basic)
  - Acceptance: smoke test runs and records timings.
  - Status: not-started

- T023 — Documentation: CONFIG.md and admin runbook
  - Acceptance: CONFIG.md documents required runtime keys and `PRODUCT_SIGNOFF_REQUIRED` flow.
  - Status: not-started

- T024 — CI: add forbidden-pattern scanner and test job
  - Acceptance: CI workflow scanning for forbidden patterns exists.
  - Status: not-started

- T025 — Polish & finalize tests, run full test suite
  - Acceptance: `npm test` exits 0 and CI checks pass locally.
  - Status: not-started

---

## 5) Immediate next actions (high-value, low-risk)

Follow these short, high-impact steps to get the subscription flow testable locally. I will not run them until you explicitly approve the LONG RUN.

1) Install dev dependencies to ensure `tsc` and other dev tools are available:

```bash
# from repo root
npm ci
# or if you prefer pnpm:
pnpm install
```

2) Compile backend sources into `dist`:

```bash
npm run build:backend
# (runs `tsc -p backend/tsconfig.json`)
```

3) Restart the compiled backend (run in background and log to `/tmp/backend.log`):

```bash
# stop any prior compiled server
pkill -f "node dist/backend/server.js" || true
# start compiled server in background and log
nohup node dist/backend/server.js > /tmp/backend.log 2>&1 &
# then monitor logs in a separate terminal:
tail -n 200 -f /tmp/backend.log
```

4) Test the subscription creation endpoint:

```bash
curl -i -X POST http://localhost:4101/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"<plan-id>"}'
```

Expect `HTTP 201` and a JSON subscription object. If the server is configured with a Supabase service role it will attempt to persist to DB; otherwise it will return an in-memory object.

5) If DB inserts fail due to schema mismatches (missing columns) I will apply a minimal fix to `backend/src/api/subscriptions.ts` to retry a simpler insert (drop optional fields like `metadata`), recompile and retest.

---

## 6) Acceptance & signoff

I added the explicit T001–T025 task list above. This file is now the single source of truth for the master plan. Per your adjusted instruction: after this file is saved you can approve a LONG RUN and I will execute the install/build/restart/test sequence and report results, or you can instruct me to hold.

Please reply with one option:
- `Approve LONG RUN` — I will run the install + build + restart + tests automatically and report results.
- `Hold` — I will wait and not run any build/start commands.

File saved at: `MASTER_PLAN.md`

---

## 7) Quick mapping of repo TODOs to the spec (short)
 - `profiles` upsert on registration — maps to T008 (models/profiles) and T016 (RLS). Status: backend handler present; integration test pending.
 - `subscriptions` creation endpoint — maps to T009 and T012/T014. Status: source added; compiled server needs rebuild.
 - Client waits for subscription before showing OrderSuccess — maps to T014/T018. Status: client source updated; E2E test pending.

---

I'll wait for your approval to execute the LONG RUN (install, compile backend, restart compiled server, test `/api/subscriptions`).

---

## 6) Quick mapping of repo TODOs to the spec (short)
- `profiles` upsert on registration — maps to T008 (models/profiles) and T016 (RLS). Status: backend handler present; integration test pending.
- `subscriptions` creation endpoint — maps to T009 and T012/T014. Status: source added; compiled server needs rebuild.
- Client waits for subscription before showing OrderSuccess — maps to T014/T018. Status: client source updated; E2E test pending.

---

File saved at: `MASTER_PLAN.md`

I'll wait for your approval to execute the LONG RUN (install, compile backend, restart compiled server, test `/api/subscriptions`).
