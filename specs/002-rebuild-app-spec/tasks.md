# Tasks — 002-rebuild-app-spec (TDD-first)

Feature: Rebuild app spec — monthly-subscription meal delivery
Spec: /home/mosab/projects/ibnalarab/specs/002-rebuild-app-spec/spec.md
Plan: /home/mosab/projects/ibnalarab/specs/002-rebuild-app-spec/plan.md

Ordering rules: tests before implementation. Models before services. Services before endpoints. Core before integration. [P] marks tasks that can run in parallel.

T001 — Setup: ensure dev scripts, lint, and tests exist [COMPLETED]
- Files: `/package.json`, `/client/`, `/tsconfig.json`
- Estimate: S
- Description: Verify/install dependencies, add `npm run lint` and `npm test` if missing, ensure TypeScript config for client and tests.
- Dependencies: none
- Acceptance: `npm ci` and `npm run lint` execute.

T002 [P] — Add test runner (vitest) and base config [COMPLETED]
- Files: `package.json`, `vitest.config.ts`, `tests/`
- Estimate: S
- Description: Add a test runner and example test; ensure tests can run for both client and server code.
- Dependencies: T001
- Acceptance: `npm test` runs and returns 0 for empty suite.

- T003 [P] — Create contract tests for `/plans` and `/checkout` [COMPLETED]
- Files: `tests/contract/plans.test.ts`, `tests/contract/checkout.test.ts`
- Estimate: M
- Description: Implement contract tests per `contracts/openapi.yaml` — they should fail initially.
- Dependencies: T002
- Acceptance: Tests present and failing.

- T004 [P] — Create model tests for entities (`profiles`, `plans`, `addresses`, `subscriptions`, `payments`) [COMPLETED]
- Files: `tests/unit/models/*.test.ts`
- Estimate: L
- Description: Add unit tests asserting model shapes and validation rules from `data-model.md`.
- Dependencies: T002
- Acceptance: Tests present and failing.

T005 — Implement `plans` model and migration templates (no prices) [COMPLETED]
- Files: `backend/src/models/plan.ts`, `migrations/001_create_plans.sql`
- Estimate: M
- Description: Implement `plans` model with `priceReference` but do not resolve numeric prices. Migration must not contain numeric seeds.
- Dependencies: T004
- Acceptance: Model compiles; unit tests begin to pass when mocked.

T006 — Implement `profiles` and `addresses` models and migrations [COMPLETED]
- Files: `backend/src/models/profile.ts`, `backend/src/models/address.ts`, `migrations/002_create_profiles_addresses.sql`
- Estimate: M
- Description: Implement these models and enforce district validation.
- Dependencies: T004
- Acceptance: Tests start to pass for profiles/addresses.

T007 — Implement `subscriptions` and `payments` models and migrations [COMPLETED]
- Files: `backend/src/models/subscription.ts`, `backend/src/models/payment.ts`, `migrations/003_create_subscriptions_payments.sql`
- Estimate: L
- Description: Implement subscription payments models and price snapshot field.
- Dependencies: T004
- Acceptance: Model tests pass.

T008 [P] — Seed `DELIVERY_DISTRICTS` (Sharjah) file with PRODUCT_SIGNOFF_REQUIRED header [COMPLETED]
- Files: `seeds/delivery_districts.json`
- Estimate: S
- Description: Add district seed for local dev; file header must include `PRODUCT_SIGNOFF_REQUIRED` marker.
- Dependencies: T006
- Acceptance: Seed exists and includes marker.

T009 — DB connection and migrations runner [COMPLETED]
- Files: `backend/src/db.ts`, `scripts/migrate.sh`
- Estimate: S
- Description: Wire DB connection and migration runner for local development.
- Dependencies: T005-T007
- Acceptance: Migrations apply to local dev DB.

T010 — Implement `GET /plans` endpoint and make contract test pass [COMPLETED]
- Files: `backend/src/api/plans.ts`, `tests/contract/plans.test.ts`
- Estimate: M
- Description: Endpoint returns plans using `priceReference` keys (no numeric resolution). Contract test must pass.
- Dependencies: T005, T009
- Acceptance: Contract test passes.

T011 — Implement `POST /checkout` endpoint (creates pending subscription) [COMPLETED]
- Files: `backend/src/api/checkout.ts`, `tests/contract/checkout.test.ts`
- Estimate: L
- Description: Validates planId/addressId, creates `subscriptions` with `pending`, returns `checkoutId`.
- Dependencies: T007, T009
- Acceptance: Contract test passes.

T012 [P] — Storage service for proof uploads (private) and signed URL stub
- Files: `backend/src/services/storage.ts`, `tests/integration/storage.test.ts`
- Estimate: M
- Description: Implement local adapter for private storage and signed URL generation stub for proofs.
- Dependencies: T007
- Acceptance: Storage tests validate path pattern and signed URLs.

T013 — Wire-transfer proof upload flow (client + API)
- Files: `client/src/pages/checkout/*`, `backend/src/api/payments.ts`
- Estimate: L
- Description: Client upload and server handling to create `payments` with `pending` status, storing proof path.
- Dependencies: T011, T012
- Acceptance: Integration tests confirm payment creation and subscription pending.

T014 — Admin review UI and endpoints for approving payments
- Files: `client/src/admin/*`, `backend/src/api/admin/payments.ts`
- Estimate: L
- Description: Admin endpoints and UI to list pending payments and approve/reject with audit logs.
- Dependencies: T013
- Acceptance: Admin contract tests pass.

T015 — RLS policies and tests
- Files: `db/rls/*.sql`, `tests/integration/rls.test.ts`
- Estimate: M
- Description: Add policies to enforce row-level access and tests verifying access rules.
- Dependencies: T009, T007, T006
- Acceptance: RLS tests pass.

T016 — Internationalization: default `ar`, `dir` toggling
- Files: `client/src/i18n/*`, `client/src/App.tsx`
- Estimate: M
- Description: Implement i18n support with `ar` default and `en` fallback; ensure `dir` toggles.
- Dependencies: T010
- Acceptance: UI tests confirm locale and dir.

T017 — MealGallery & MealPlanPreview components (TDD)
- Files: `client/src/components/MealsGallery/*`, `client/src/components/MealPlanPreview/*`
- Estimate: L
- Description: Components must accept props as defined in spec and show placeholders if pricing config missing.
- Dependencies: T010, T016
- Acceptance: Component tests pass.

T018 — Checkout UI guard for missing runtime config (disable CTA)
- Files: `client/src/pages/checkout/*`, `client/src/services/config.ts`
- Estimate: M
- Description: If `VAT_RATE` or plan price resolution missing, show error and disable payment actions.
- Dependencies: T011, T016
- Acceptance: Tests simulate missing config and verify behavior.

T019 — Accessibility tests and improvements for gallery and checkout
- Files: `tests/accessibility/*`
- Estimate: M
- Description: Add keyboard and screen reader tests and fix issues.
- Dependencies: T017
- Acceptance: Accessibility tests pass.

T020 — Contract tests for admin payment approval endpoints
- Files: `tests/contract/admin_payments.test.ts`
- Estimate: M
- Description: Tests asserting admin endpoints conform to `contracts/openapi.yaml`.
- Dependencies: T014
- Acceptance: Contract tests pass.

T021 — Pricing integration task (post PO signoff)
- Files: `backend/src/services/pricing.ts`, `client/src/services/pricing.ts`
- Estimate: M
- Description: Implement resolution of `priceReference` to numeric values from runtime config; gated by `PRODUCT_SIGNOFF_REQUIRED` clearance.
- Dependencies: T019, T018
- Acceptance: Tests for pricing resolution added; gated by `PRODUCT_SIGNOFF_REQUIRED` in config.

T022 — CI: forbidden-pattern scanner and test job
- Files: `.github/workflows/ci.yml`, `scripts/forbidden-scan.sh`
- Estimate: M
- Description: Add CI job to lint/typecheck/tests and forbid patterns (`FIXME_PRICE`, `HARDCODED_VAT`, `INSERT INTO public.plans`, `PRODUCT_SIGNOFF_REQUIRED`).
- Dependencies: T001, T002
- Acceptance: Workflow added.

T023 — Seed and migration docs for admins (no price seeds)
- Files: `docs/migrations.md`, `seeds/README.md`
- Estimate: S
- Description: Document that plan price seeds are forbidden and must be provided via admin UI after PO signoff.
- Dependencies: T010
- Acceptance: Documentation added.

T024 — Polish: tests, flake fixes, and final QA
- Files: `tests/**`, `specs/**`
- Estimate: M
- Description: Run full test suite, fix failures, update docs.
- Dependencies: all previous
- Acceptance: `npm test` OK locally; CI passes.

T025 — Release prep and admin checklist
- Files: `RELEASE.md`, `CONFIG.md`
- Estimate: S
- Description: Create release notes, admin checklist to set runtime config and remove `PRODUCT_SIGNOFF_REQUIRED` marker after PO signoff.
- Dependencies: T023, T021
- Acceptance: Release docs present and complete.

Parallel execution guidance
- [P] tasks that can run in parallel: T003, T004, T005, T006, T008, T012
- Example: `run-tasks --parallel T003 T004 T005 T006 T008`

Notes
- Respect `PRODUCT_SIGNOFF_REQUIRED` and forbidden-pattern rules. Do not commit numeric prices.
