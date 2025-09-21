# Tasks — 001-initial-build (TDD-first)

Feature: Initial Build — subscription-only weekly meal delivery
Spec: /home/mosab/projects/ibnalarab/specs/001-initial-build/spec.md
Plan: /home/mosab/projects/ibnalarab/specs/001-initial-build/plan.md

Ordering rules: tests before implementation. Models before services. Services before endpoints. Core before integration. [P] marks tasks that can run in parallel.

T001 — Setup: repo bootstrap and lint
- Files: `/package.json`, `/client/`, repo root
- Estimate: S
- Description: Ensure repository dependencies install, add lint and typecheck scripts if missing. Add `npm run lint` and `npm run test` commands to package.json.
- Dependencies: none
- Acceptance: `npm install` runs, `npm run lint` exits 0 (or reports lint issues), `npm run test` exists (may fail if no tests yet).
- Agent example: `npm install && npm run lint`

T002 [P] — Add project testing skeleton (vitest)
- Files: `/package.json`, `/tests/`
- Estimate: S
- Description: Add `vitest` (or `jest` if preferred) with a simple configuration and a placeholder test runner script `npm test` that runs tests. Create `tests/unit/.placeholder`.
- Dependencies: T001
- Acceptance: `npm test` runs and returns 0 when no tests fail.

T003 [P] — Create failing contract tests for `GET /plans`
- Files: `specs/001-initial-build/contracts/contract-tests.md`, `tests/contract/plans.test.ts`
- Estimate: M
- Description: Write a test that calls `GET /plans` (mock server) and asserts response matches `Plan` schema; test should fail until implementation exists.
- Dependencies: T002
- Acceptance: Test exists and fails when run against no implementation.

T004 [P] — Create failing contract test for `POST /checkout`
- Files: `tests/contract/checkout.test.ts`
- Estimate: M
- Description: Write a test that sends `{ planId, addressId }` to `POST /checkout` and asserts `200` and `checkoutId` in response; must fail initially.
- Dependencies: T002
- Acceptance: Test present and fails.

T005 [P] — Create model tests for `plans` entity
- Files: `tests/unit/models/plans.test.ts`, `src/models/plan.ts` (placeholder)
- Estimate: M
- Description: Define the `Plan` model shape and tests asserting validation (presence of `id`, `title_*`, `priceReference`). Tests must fail until model implemented.
- Dependencies: T002
- Acceptance: Tests present and failing.

T006 [P] — Create model tests for `profiles`, `addresses`, `subscriptions`, `payments`
- Files: `tests/unit/models/*.test.ts`, `src/models/*.ts`
- Estimate: L
- Description: Add tests for each core entity from `data-model.md` asserting fields and relations. Tests must be runnable and fail before implementation.
- Dependencies: T002
- Acceptance: Test files present and failing.

T007 — Implement `plans` model and DB migration (schema only)
- Files: `backend/src/models/plan.ts`, `migrations/001_create_plans.sql` (template)
- Estimate: M
- Description: Implement the `plans` model and create a migration template without numeric seeds. Migration must not include `INSERT INTO public.plans` or price literals.
- Dependencies: T005
- Acceptance: Model compiles and migration applies to a local dev DB; tests from T005 start to pass (after wiring DB mocks).

T008 — Implement `profiles` and `addresses` models and migrations
- Files: `backend/src/models/profile.ts`, `backend/src/models/address.ts`, `migrations/002_create_profiles_addresses.sql`
- Estimate: M
- Description: Implement profiles and addresses models and migrations. Enforce `district` validation in model layer.
- Dependencies: T006
- Acceptance: Models compile; unit tests for models begin to pass.

T009 — Implement `subscriptions` and `payments` models and migrations
- Files: `backend/src/models/subscription.ts`, `backend/src/models/payment.ts`, `migrations/003_create_subscriptions_payments.sql`
- Estimate: L
- Description: Implement subscription/payment models. `subscriptions` must include `price_reference_snapshot` JSON field and `status` enum.
- Dependencies: T006
- Acceptance: Model unit tests pass locally.

T010 [P] — Add DB connection and simple seed for delivery districts (no prices)
- Files: `backend/src/db.ts`, `seeds/delivery_districts.json`
- Estimate: S
- Description: Add database connection utility and a curated seed for `DELIVERY_DISTRICTS` (Sharjah districts) but do not seed plan prices; include `PRODUCT_SIGNOFF_REQUIRED` note in seed file header.
- Dependencies: T007, T008
- Acceptance: Seed can be applied locally; contains `PRODUCT_SIGNOFF_REQUIRED` marker in header.

T011 — Implement `GET /plans` endpoint (failing tests become green)
- Files: `backend/src/api/plans.ts`, `tests/contract/plans.test.ts`
- Estimate: M
- Description: Implement endpoint to return plan list using `plans` model and `priceReference` keys (do not resolve numeric prices yet). Contract test T003 should now pass if endpoint returns correct shape.
- Dependencies: T007, T010
- Acceptance: `tests/contract/plans.test.ts` passes.

T012 — Implement `POST /checkout` endpoint (create checkout record placeholder)
- Files: `backend/src/api/checkout.ts`, `tests/contract/checkout.test.ts`
- Estimate: L
- Description: Implement checkout start endpoint that validates `planId` and `addressId`, creates a `subscription` with `pending` status and returns `checkoutId`. Should not compute numeric totals until PO values provided.
- Dependencies: T009, T011
- Acceptance: `tests/contract/checkout.test.ts` passes.

T013 [P] — Implement upload handling (private storage) with signed URL generation stub
- Files: `backend/src/services/storage.ts`, `tests/integration/upload.test.ts`
- Estimate: M
- Description: Implement storage service wrapper that uploads proofs to private bucket path `payment-proofs/{user_id}/{subscription_id}/{timestamp}-{filename}`. Use local filesystem adapter for tests; include signed URL generation stub.
- Dependencies: T009
- Acceptance: Upload tests run and validate path conventions.

T014 — Implement wire-transfer flow: client files + server processing
- Files: `client/src/pages/checkout/*`, `backend/src/services/wireTransfer.ts`
- Estimate: L
- Description: Client UI to upload proof and submit payment metadata; server-side to create `payments` row and maintain `subscription` status `pending`.
- Dependencies: T012, T013
- Acceptance: Integration tests simulate proof upload and server creates `payments` row and `subscription` remains `pending`.

T015 — Admin: review payments UI & endpoints (approve/reject)
- Files: `client/src/admin/payments/*`, `backend/src/api/admin/payments.ts`
- Estimate: L
- Description: Admin endpoint to list pending payments and approve/reject with audit logging; approval will set `subscription.status` to `active` and create audit entry.
- Dependencies: T014
- Acceptance: Admin integration test verifies approve flow updates subscription and audit.

T016 — Add RLS policies and tests for `profiles`, `subscriptions`, `payments`
- Files: `db/rls/*.sql`, `tests/integration/rls.test.ts`
- Estimate: M
- Description: Add Postgres RLS policies ensuring users can access only their data unless admin. Add tests that simulate access patterns.
- Dependencies: T007, T008, T009
- Acceptance: RLS test asserts unauthorized access is denied.

T017 — Implement internationalization support (ar/en) in UI
- Files: `client/src/i18n/*`, `client/src/App.tsx`
- Estimate: M
- Description: Add locale toggle and ensure default locale `ar` is used. Ensure `dir` attribute toggles between `rtl` and `ltr`.
- Dependencies: T011
- Acceptance: UI tests confirm text and dir toggle behavior.

T018 — Implement MealsGallery and MealPlanPreview components (tests-first)
- Files: `client/src/components/MealsGallery/*`, `client/src/components/MealPlanPreview/*`, `tests/unit/components/*`
- Estimate: L
- Description: Component unit tests for gallery tabs keyboard navigation and fallback images; MealPlanPreview must accept `priceReference` and show placeholders if config missing.
- Dependencies: T011, T017
- Acceptance: Component unit tests pass.

T019 — Implement checkout total calculation guard & config error state
- Files: `client/src/pages/checkout/*`, `backend/src/services/pricing.ts`
- Estimate: M
- Description: Implement guard that requires runtime values `VAT_RATE` and plan price resolution; if missing, UI shows config-warning and disables payment actions.
- Dependencies: T012
- Acceptance: Tests simulate missing config and verify checkout is disabled and warning shown.

T020 — Accessibility and keyboard navigation testing for main page and gallery
- Files: `tests/accessibility/*`
- Estimate: M
- Description: Add accessibility tests ensuring keyboard nav and screen reader labels for hero, gallery, and checkout.
- Dependencies: T017, T018
- Acceptance: Accessibility tests pass or report actionable items.

T021 — Add contract tests for admin payment approval endpoint
- Files: `tests/contract/admin_payments.test.ts`
- Estimate: M
- Description: Contract test asserting admin endpoints for listing/approving payments behave per openapi contract.
- Dependencies: T015
- Acceptance: Contract test present and passes against implementation.

T022 — Performance & load smoke test (basic)
- Files: `tests/perf/smoke.test.ts`
- Estimate: M
- Description: Add a small load test that runs basic plan listing and checkout start to ensure basic performance goals (low scale).
- Dependencies: T011, T012
- Acceptance: Smoke test runs and records timings.

T023 — Documentation: CONFIG.md and admin runbook
- Files: `CONFIG.md`, `specs/001-initial-build/quickstart.md` (update)
- Estimate: S
- Description: Document required runtime keys and `PRODUCT_SIGNOFF_REQUIRED` flow in `CONFIG.md` and link from quickstart.
- Dependencies: T019
- Acceptance: `CONFIG.md` exists and references `PRODUCT_SIGNOFF_REQUIRED` marker.

T024 — CI: add forbidden-pattern scanner and test job
- Files: `.github/workflows/ci.yml`, `scripts/forbidden-scan.sh`
- Estimate: M
- Description: Add GitHub Actions job that runs lint/typecheck/tests and runs a regex scanner rejecting `FIXME_PRICE|HARDCODED_VAT|INSERT\s+INTO\s+plans|PRODUCT_SIGNOFF_REQUIRED` (in code files). Scanner should allow `specs/` and `docs/` unless they intentionally include markers.
- Dependencies: T001, T002
- Acceptance: CI workflow file created; running locally with `act` is optional.

T025 — Polish & finalize tests, run full test suite
- Files: `tests/**`
- Estimate: M
- Description: Fix failing tests, run full suite, update docs and fix any flakiness. Ensure no forbidden-pattern violations remain.
- Dependencies: all previous
- Acceptance: `npm test` exits 0 and CI checks pass locally.

Parallel execution guidance
- Can run in parallel: T003, T004, T005, T006 (test skeletons), and T010 (seed districts) — marked [P].
- Example agent command to run grouped tasks:
  - `run-tasks --parallel T003 T004 T005 T006`

Notes
- Do NOT commit numeric plan prices or SQL INSERT seeds. Use `PRODUCT_SIGNOFF_REQUIRED` marker for any file that references runtime pricing until PO signs off.
