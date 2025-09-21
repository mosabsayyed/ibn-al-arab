# Project Constitution: Ibn Al Arab

This document outlines the foundational principles for the Ibn Al Arab project. All development, whether by human or AI, must strictly adhere to these rules.

---

## 0. Prime Directive: This is a Live, Critical Project

This is not a test, a demo, or an experiment. It is a real-world application with real users whose livelihoods and personal data are at stake. There is zero tolerance for errors in financial calculations, order processing, or the handling of private user information. The "No Assumptions" principle is the bedrock of this project's integrity and must be treated as the highest priority in every decision.

Any code, configuration, or data that affects pricing, billing, order fulfillment, or user privacy must follow the explicit rules in this constitution before it can be merged or deployed.

---

## 1. Core Philosophy: No Assumptions

The single most important principle is the complete avoidance of hard-coded, business-critical constants within the repository.

- No Hard-Coded Business Values: Under no circumstances shall numeric constants for prices, VAT rates, or other business-sensitive data be committed. All such values must be represented by placeholder keys (for example: `priceReference`, `PLAN_PRICES`, `VAT_RATE_KEY`).
- PO Sign-off is Mandatory: All business-critical values (like `CURRENCY`, `VAT_RATE`, `PLAN_PRICES`) must be populated from a secure, external configuration source (deployed/config service, secrets manager, or environment injected by infra). Before being used in production behavior, the configuration requires explicit sign-off from the Product Owner (PO).
- Placeholder Marker: Any file containing a placeholder that requires PO sign-off MUST include the exact marker: `PRODUCT_SIGNOFF_REQUIRED` on the same file (top-level comment or manifest). This marker enables automated detection in CI.

Examples of forbidden commits:
- Any file that includes `12.50` as a hard-coded price for a plan or meal.
- Any `.sql` file with `INSERT` statements that seed pricing or plan values committed to repo (see Section 3).

---

## 2. Technology Stack & Architecture

- Frontend: TypeScript-first. Use strict typing and share types with backend where possible.
- Backend: Supabase is the canonical backend for Authentication, Postgres database, and File Storage.
- Localization: The application must be fully bilingual. Support English (`en`, `ltr`) and Arabic (`ar`, `rtl`). UI must properly flip layout for RTL locales and provide mirrored icons/spacing where appropriate.
- Deployment: Infrastructure must provide secure secret injection (no committed secrets), enable environment-based configuration, and support feature flags when needed.

---

## 3. Security & Data Integrity

- Row-Level Security (RLS): RLS must be enabled on all tables that contain Personally Identifiable Information (PII). Default policy: deny, then explicitly allow the minimum required principals.
- Secure File Uploads: Sensitive or private files must be uploaded to a private Supabase Storage bucket. Access must be granted via short-lived signed URLs. Do not make private files public.
- No Raw SQL Inserts for business-critical data: Do not commit `.sql` files containing `INSERT` statements for `plans` or other critical, business-affecting seed data. Seeding must be handled by protected admin scripts that run with elevated privileges and require operator authentication/authorization.
- Secrets and Keys: Never commit secrets. Provide a `secrets.example` or `.env.example` showing required keys; actual values must be stored in the deployment secrets manager.

---

## 4. Code Quality & Process

- Strict CI/CD: The CI/CD pipeline must run `lint`, `typecheck`, and `test` for every push/PR. CI must also run scanners to detect forbidden patterns (see Enforcement). Failing CI blocks merges.
- Forbidden Patterns: Commits containing forbidden markers must be rejected by pre-commit/CI scanners. Examples of forbidden patterns include (but are not limited to): `FIXME_PRICE`, `HARDCODED_VAT`, `PRICE_HARDCODED`, `PRODUCT_SIGNOFF_REQUIRED` left unresolved, `FIXME_PRICING`, `INSERT INTO plans` in committed `.sql` files. Keep the forbidden list small and authoritative; add more items by PR and update CI.
- Robust Error Handling: If essential configuration (like pricing values) is missing or unsigned, the UI must display a clear, actionable error and disable dependent functionality (for example: checkout). The application must not proceed silently — fail fast with clear user and operator messages.
- Accessibility: All interactive UI components must be fully accessible via keyboard and comply with WCAG 2.1 AA where practical. Provide meaningful ARIA attributes for non-semantic UI patterns.
- Tests: Unit tests for all business logic and components; integration tests for critical flows (auth, checkout, order lifecycle). Pricing calculations must have deterministic unit tests with documented sources.

---

## 5. Data Contracts

All code must strictly adhere to the data contracts defined in `MAIN_PAGE_SPEC.md` for entities like `Plan` and `Meal`. If a contract change is required, it must be versioned, documented, and approved by stakeholders; both consumers and providers must coordinate migration.

---

## Enforcement — Detection & CI Integration

- PRODUCT_SIGNOFF_REQUIRED: CI must detect any file that contains the literal token `PRODUCT_SIGNOFF_REQUIRED`. PRs containing this token must fail CI until resolved and signed off by the PO. The presence of this token indicates that the file contains placeholders that must be completed and ratified.
- Forbidden-pattern scanner: CI must run a regex-based scanner that rejects PRs containing the configured forbidden patterns (e.g. `FIXME_PRICE|HARDCODED_VAT|PRICE_HARDCODED|INSERT\s+INTO\s+plans`).
- Secret scanner: run a secrets detector on diffs.
- Pre-merge gates: lint, typecheck, tests, forbidden-pattern scan, and secret scan. Only then allow review and merge.

---

## Runtime Safety & UX Requirements

- Defensive UI: When critical config is missing (e.g., `PLAN_PRICES`), show a clear operator-facing banner and disable any flows that rely on that config (example: disable checkout button, show customer-friendly message). Log an actionable error to server logs with a correlation id.
- Fail-safe behavior: For any operation that changes financial state (orders, refunds, invoice generation), require server-side validation and an auditable trail. Do not rely on client-side checks for authoritative data.

---

## Localization & UX

- All translations must be stored outside the code as locale files. The project must support fallback locales and report missing translations during CI.
- RTL support: verify layout snapshots for `ar` in visual tests.

---

## PR & Release Checklist (add to PR template)

- [ ] Linked issue and description
- [ ] `PRODUCT_SIGNOFF_REQUIRED` is not present in any merged file (unless accompanied by PO signoff documentation)
- [ ] No forbidden patterns in diff (CI scan)
- [ ] Tests added/updated for changes
- [ ] TypeScript typecheck passes
- [ ] Linting passes
- [ ] No secrets in diffs
- [ ] Accessibility/keyboard checks for UI changes
- [ ] Reviewer(s) assigned; at least one reviewer other than author

---

## Governance & Amendments

- This constitution is authoritative for the Ibn Al Arab project. Amendments require a documented proposal, approval from the Product Owner and at least one senior maintainer, and an accompanying migration/rollout plan for any operational changes.
- Exceptions: Non-routine exceptions (security trade-offs, emergency hotfixes) must be recorded in the PR with rationale, mitigations, and a follow-up remediation plan.

---

## Version & Ratification

**Version**: 1.1.0 | **Ratified**: 2025-09-21 | **Last Amended**: 2025-09-21

---

## Notes & Next Steps (recommended)

- Add `PR_TEMPLATE.md` using the PR checklist above.
- Add CI job that runs the forbidden-pattern scanner and `PRODUCT_SIGNOFF_REQUIRED` detector.
- Add `secrets.example` and `README.md` notes about PO signoff and configuration flow.
- Implement admin-only seed scripts (outside of public `.sql` commits) for protected environments.