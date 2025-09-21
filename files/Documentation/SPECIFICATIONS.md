# Project Specifications — Ibn Al Arab

Last updated: 2025-09-21

Purpose: This file is the top-level, assumption-free product specification used as the authoritative requirements source for rebuilding the application from a fresh repository. It contains the 14 high-level points (purpose, scope, entities, flows, etc.) without any numeric seeds or sample INSERT statements. All numeric business constants are placeholders and require Product Owner (PO) signoff before use.

1. Purpose and scope
  - Purpose: Define requirements for a subscription-only weekly meal delivery web app.
  - Scope: Frontend (TypeScript-first), Backend (Supabase: Auth, Postgres, Storage), File uploads for payment proofs, Bilingual EN/AR, Sharjah-only delivery by district.

2. Definitions and placeholders (MANDATORY)
  - CURRENCY: placeholder (e.g., `AED`) — confirm with PO.
  - VAT_RATE: placeholder (e.g., `5%`) — must be provided and signed off by PO.
  - PLAN identifiers and PRICING: defined as placeholders; no numeric values in repo.
  - MAX_UPLOAD_SIZE, ALLOWED_UPLOAD_TYPES, DELIVERY_DISTRICTS, ADMIN_USERS: placeholders.

3. Core entities (semantic overview)
  - `profiles` — link to `auth.users`; fields: personal details, `is_student`, `is_admin`, `locale`.
  - `plans` — id/slug, localized titles, description, `meals_per_week`, price references (no numeric seeds here).
  - `addresses` — user delivery addresses; `district` must be validated against `DELIVERY_DISTRICTS`.
  - `subscriptions` — user subscriptions; contains `status`, references to plan and address; price references (placeholders).
  - `payments` — metadata of uploaded proofs and method.

4. Auth & security model
  - Use Supabase Auth. Enable RLS on PII tables.
  - Policies: users can `select`/`insert`/`update` their own rows; admins (flag or separate table) have elevated privileges.
  - Storage: private bucket for proofs; use signed URLs for admin access.

5. Checkout flow (contract)
  - Checkout accepts `plan` via query param (e.g., `/checkout?plan={planSlug}`).
  - Checkout computes `subtotal`, `vat`, `total` using PO-provided numeric constants.
  - If numeric constants missing, checkout must error and require admin configuration.
  - On wire-transfer: upload proof to storage, create `subscriptions`(status='pending') and `payments` rows.

6. File upload behavior
  - Upload path convention: `payment-proofs/{user_id}/{subscription_id}/{timestamp}-{filename}`.
  - Client validates `ALLOWED_UPLOAD_TYPES` and `MAX_UPLOAD_SIZE`. Server validation optional but recommended.

7. Admin workflows
  - Admins review pending payments, approve/reject subscriptions, and record audit details.

8. Localization & directionality
  - Two locales: `en` and `ar`. Root `dir` toggles between `ltr` and `rtl`.
  - Currency formatting follows locale rules; numeric math is locale-agnostic.

9. Tests and CI
  - Unit tests for pricing math (when PO numeric values are provided), district validation, and upload rules.
  - E2E scenarios for sign-up → subscribe → upload → approve.

10. Developer guardrails
  - No hard-coded numeric business constants in code or seed files. All constants must be explicit placeholders with PO signoff.
  - Pre-commit/CI rules must block commits containing `FIXME_PRICE`, `HARDCODED_VAT`, or direct `INSERT INTO public.plans VALUES(...)` patterns.

11. Schema reference
  - The authoritative DB schema exists and will not be migrated here. This spec references the `profiles`, `plans`, `addresses`, `subscriptions`, and `payments` tables semantically. Do not include seeds or numeric values.

12. Image assets
  - Images are the only assets that will be ported to the new repo. Use the provided `files/` and `public/` images only.

13. Archival / freeze process
  - Freeze current repo on a branch `frozen/archive-YYYYMMDD` before creating a fresh repo.

14. Signoff
  - No seeds, numeric constants, or live payment gateways should be committed without explicit PO signoff. The PO must signoff a `CONFIG.md` or admin UI entry for numeric constants before enabling checkout.

---

Appendix: placeholders that MUST be provided by PO before launch
- `CURRENCY`
- `VAT_RATE`
- `PLAN_PRICES` (per plan)
- `MAX_UPLOAD_SIZE`
- `ALLOWED_UPLOAD_TYPES`
- `DELIVERY_DISTRICTS`
