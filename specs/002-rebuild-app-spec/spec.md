## Proof uploads & retention
Payment proofs are stored in database-backed storage (see `payments.receipt_url` in DB). The webapp does not enforce a retention date; accounting/ops manage retention and archival outside the webapp. The webapp must serve proofs via short-lived signed URLs for admin review and ensure proper access controls.
(The file `/home/mosab/projects/ibnalarab/specs/002-rebuild-app-spec/spec.md` exists, but is empty)
````markdown
# Feature Specification: Rebuild app spec: monthly-subscription meal delivery

**Feature Branch**: `002-rebuild-app-spec`  
**Created**: 2025-09-21  
**Status**: Draft  
**Input**: User description: "Rebuild app spec: monthly-subscription meal delivery"

## Execution Flow (main)
```
1. Parse user description from Input
	→ If empty: ERROR "No feature description provided"
2. Extract key concepts from description
	→ Identify: actors, actions, data, constraints
3. For each unclear aspect:
	→ Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
	→ If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
	→ Each requirement must be testable
	→ Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
	→ If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
	→ If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no low-level APIs or secrets in spec)
- 👥 Written for business stakeholders and product + engineering alignment

### Section Requirements
- All mandatory sections below are completed. Where the user's input included explicit tech choices (Supabase, TypeScript, localization), those are referenced in a non-implementation-binding way for clarity.

---
4. Given an authenticated user views payment methods at checkout, Then the credit-card option is visible but presented in a dimmed/disabled state with a tooltip/note: "Card payments coming soon — working with bank"; wire-transfer remains active for now.


- If a user's `district` is outside `DELIVERY_DISTRICTS`, the address should be rejected client-side and server-side with a clear validation error.
- If `VAT_RATE` or `PLAN_PRICES` are later changed, migration must be coordinated and recorded; historical invoices must remain auditable.

---


### Functional Requirements
- **FR-001**: System MUST render the main page (hero, plans list, meals gallery) and allow navigation to checkout for a selected plan.
- **FR-002**: System MUST support internationalization for `en` and `ar` locales, toggling `dir` between `ltr` and `rtl`.
- **FR-004**: Checkout MUST compute `subtotal`, `vat`, and `total` using numeric constants provided by PO; if missing, checkout must error and disable payment actions.
- **FR-005**: On wire-transfer payment method, the client MUST upload proof to private storage using path convention `payment-proofs/{user_id}/{subscription_id}/{timestamp}-{filename}` and create `subscriptions` with `pending` status and `payments` metadata.
- **FR-006**: Server MUST enable RLS on PII tables and enforce that users can only access their own `profiles`, `subscriptions`, and `payments` rows unless elevated as admin.
- **FR-007**: Admins MUST be able to review pending payments and approve/reject subscriptions; approvals update `subscriptions.status` and append audit records.
- **FR-008**: The app MUST validate upload types and sizes against runtime placeholders `ALLOWED_UPLOAD_TYPES` and `MAX_UPLOAD_SIZE` (client validation required; server-side validation recommended).
- **FR-010**: The `MealsGallery` MUST provide accessible keyboard navigation for its tabs and fallback images when `meal.image` is missing.

*Ambiguities / Clarifications*
- **FR-011**: Payment methods: Resolved by PO — only two methods will be present at launch. `wire_transfer` is the primary active backend flow. Credit-card payments will be visible in the UI but remain visually dimmed/disabled and labeled "Coming Soon"; no backend card processing will be implemented yet. There may be multiple card providers in the future; provider selection and integration timeline are out-of-scope for the initial webapp and will be handled as a separate feature when the bank/provider is chosen.

PO Decisions and references
--------------------------
- Pricing source: `PLAN_PRICES`, `VAT_RATE`, and `CURRENCY` are served from a Supabase table (runtime). The DB tables already exist in the repo reference at `local files/Existing DB tables.txt` (contains `create table public.plans`, `public.subscriptions`, `public.payments`, etc.). Implementations must read price values from the runtime Supabase config table and must NOT hardcode numeric prices.
- Delivery districts: Canonical Sharjah district list is provided in `local files/districts.txt` (includes Arabic/English names). Use this file as the authoritative seed for `DELIVERY_DISTRICTS`.
- Subscription lifecycle: Subscriptions are monthly. A subscription becomes active 24 hours after receiving subscription fees. Cancellation stops future renewals but does not trigger refunds; refunds are handled outside the webapp.
- Discounts: Student or promotional discounts are stored in the `plans` table (see `discounted_price_aed` and related fields in `local files/Existing DB tables.txt`). Use the DB values as authoritative.
- Proof uploads & retention: Retention and accounting lifecycle decisions are made by accounting/ops and are out of scope for the webapp; the webapp should store proofs in private storage and generate short-lived signed URLs for admin review, but retention policy details are not required here.
---

### Key Entities *(include if feature involves data)*
- **plans**: id/slug, localized titles & descriptions, `meals_per_week`, `days`, `priceReference`, `studentPriceReference`, `discountLabel`. Numeric prices are referenced via `priceReference` keys to external config.
- **addresses**: `address_id`, `user_id`, `street`, `city`, `district`, `postal_code`; `district` must belong to `DELIVERY_DISTRICTS`.
- **subscriptions**: `subscription_id`, `user_id`, `plan_id`, `address_id`, `status` (pending/active/cancelled/failed), `started_at`, `ended_at`, `price_reference_snapshot` (reference to values used at time of subscription), audit fields.
- **payments**: `payment_id`, `subscription_id`, `user_id`, `method`, `status`, `proof_path`, `metadata` (original filename, size, content-type), timestamps.
---

### Content Quality
- [x] No committed numeric business constants or seed INSERT statements in this spec
- [x] Focused on user value and business needs
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain — (see FR-011)
- [x] Requirements are testable and unambiguous where PO inputs are provided

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed (awaiting clarification on payment methods)

---

## Implementation Notes (non-normative)
- Use Supabase for Auth, Postgres, and private Storage buckets. Enable RLS and audit logging for PII and payments.
- Implement a runtime configuration endpoint or admin UI that stores and exposes `CURRENCY`, `VAT_RATE`, `PLAN_PRICES`, `MAX_UPLOAD_SIZE`, `ALLOWED_UPLOAD_TYPES`, `DELIVERY_DISTRICTS`, and `ADMIN_USERS`. Each such config item requires documented PO signoff before enabling checkout.
- Client components (`MealPlanPreview`, `MealsGallery`) must fetch runtime price values from a secure endpoint rather than embedding numeric values at compile time.
- Add CI checks: forbid `FIXME_PRICE`, `HARDCODED_VAT`, or `INSERT INTO public.plans` in diffs.

---

## Acceptance Criteria (explicit)
- Main page renders hero, plans (one per `Plan` object), and gallery without JS errors.
- Clicking `Subscribe` navigates to `/checkout?plan={planId}` and preserves locale.
- If numeric pricing config missing, UI shows explicit error and disables subscription CTA.
- Meals gallery tabs are keyboard navigable and localized.

---

## Appendix: placeholders that MUST be provided by PO before launch

---

## Context7 Guidance (Supabase / Security / CI) — added 2025-09-22

This section collects concise, authoritative best-practices from Context7 references (Supabase/Postgres/RLS, CI) relevant to the feature.

Profiles, Subscriptions, Payments
- Enable Row-Level Security (RLS) on all tables containing PII or payment-related data. Default to DENY, then add minimal policies.
- Example SQL to enable RLS and a simple user-scoped policy:

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_owner ON public.profiles
	FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_owner ON public.subscriptions
	FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_owner ON public.payments
	FOR SELECT USING (auth.uid() = user_id);
```

- For complex access (teams, admin views), implement SECURITY DEFINER helper functions that return allowed ids, and call those functions in policies to keep policies simple and auditable. Grant EXECUTE only to the authenticated role when appropriate.

- Add b-tree indexes on columns referenced by policies (e.g. `user_id`, `subscription_id`) to keep policy evaluation fast.

- Add pgtap/integration tests that assert RLS is enabled and that `auth.uid()` constraints hold for `profiles`, `payments`, and `subscriptions`. CI must fail if tests detect policy regressions.

Uploads & Storage
- Use private Supabase Storage buckets for payment proofs and other sensitive files. Do not expose private buckets publicly. Serve files with short-lived signed URLs generated server-side for admin review.
- Path convention and access: `payment-proofs/{user_id}/{subscription_id}/{ts}-{filename}`.
- Validate file types and sizes server-side; reject disallowed types and enforce size limits. Keep `ALLOWED_UPLOAD_TYPES` and `MAX_UPLOAD_SIZE` in runtime config (not hard-coded).

Localization & UX
- Provide full bilingual support (Arabic `ar` rtl + English `en` ltr). Store translations outside code in locale files; CI should detect missing translations.
- UI must flip layout for RTL locales; test with visual regression checks for common pages (homepage, checkout, admin review).

CI / Enforcement
- CI must run `lint`, `typecheck`, `tests`, and a forbidden-pattern scanner on every PR. Forbidden patterns include: `FIXME_PRICE`, `HARDCODED_VAT`, `PRICE_HARDCODED`, `PRODUCT_SIGNOFF_REQUIRED` (unresolved), and `INSERT INTO public.plans` in committed SQL files.
- Implement an automated detector for `PRODUCT_SIGNOFF_REQUIRED` so configuration placeholders block merges until PO signoff.
- Add a CI job that runs pgtap/integration tests against a disposable Postgres instance (or a test Supabase project) to assert RLS and policy behavior.

Operational Notes / Quick Checklist
- Ensure migrations include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for PII/payments tables.
- Create and deploy SECURITY DEFINER helper functions before adding policies that call them.
- Add DB indexes for policy columns in the same migration where policies are added.
- Add CI coverage that asserts: migrations applied, RLS enabled, policies enforce `auth.uid()` constraints, and forbidden-pattern scanner passes.


---

````
