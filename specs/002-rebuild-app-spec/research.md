````markdown
# Research: Rebuild app spec (monthly-subscription meal delivery)

## Purpose
Resolve open questions and document decisions before design: payment methods, delivery constraints, locale defaults, nutrition data source, branding and assets, and admin workflows.

## Resolved Questions

- Payment methods: Primary (available now) = wire-transfer. Secondary (planned) = credit-card. The credit-card option will be shown in the UI but dimmed/disabled until bank integration completes.
- Delivery area: Restricted to Sharjah (city). Users must select a Sharjah district from `DELIVERY_DISTRICTS` and provide a free-form address field for details.
- Locale: Default locale is Arabic (`ar`). The site supports English (`en`) as secondary. `dir` toggles between `rtl` and `ltr`.
- Product model: Product is a meal plan (monthly subscription), not single-meal purchases. No per-meal pricing will be stored or displayed.
- Nutrition data: Nutrition facts must be calculated from authoritative sources (USDA FoodData Central). Calculations should be part of content preparation and validated before publishing.
- Branding and assets: Use provided assets in `files/` and `public/`. Brand palette: red (strips, emphasis), white (background), black (text/lines). Mascot images (Chef) provided per plan.

## Outstanding Clarifications (to be captured as admin config or future tasks)

- Bank integration schedule and bank's API details for credit-card processing (required to enable card payments).
- Exact list of Sharjah districts for `DELIVERY_DISTRICTS` placeholder — provide by PO/admin.
- Confirm PO signoff workflow for `PLAN_PRICES`, `VAT_RATE`, and `CURRENCY` (document how PO will sign in `CONFIG.md`).

## Decision Rationale

- Showing credit-card option dimmed encourages signups while signalling roadmap progress; wire-transfer keeps revenue flow available.
- Restricting to Sharjah reduces initial operational complexity and matches user base.
- Defaulting to Arabic aligns with target market and improves initial UX conversions.

## Outputs
- This research resolves FR-011: payment methods clarified (wire-transfer active; cards dimmed).
- Documented delivery behavior for address collection and validation.

````
