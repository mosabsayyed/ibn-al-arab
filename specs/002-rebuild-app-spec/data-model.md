````markdown
# Data Model: Rebuild app spec (monthly-subscription meal delivery)

## Entities

- profiles
  - user_id: uuid (links to auth.users)
  - first_name: string
  - last_name: string
  - email: string
  - is_student: boolean
  - is_admin: boolean
  - locale: enum(`ar`,`en`)
  - created_at, updated_at

- plans
  - id: string (slug)
  - title_en: string
  - title_ar: string
  - description_en: text
  - description_ar: text
  - meals_per_week: integer
  - days: integer
  - priceReference: string (key into runtime pricing config stored in Supabase `plan_prices` table)
  - studentPriceReference: string
  - discountLabel: string

- addresses
  - address_id: uuid
  - user_id: uuid
  - district: string (must be in DELIVERY_DISTRICTS — Sharjah only)
  - address_line: text
  - created_at, updated_at

- subscriptions
  - subscription_id: uuid
  - user_id: uuid
  - plan_id: string
  - address_id: uuid
  - status: enum(pending, active, cancelled, failed)
  - price_reference_snapshot: json (store references used at subscribe time)
  - started_at, ended_at, created_at, updated_at

- payments
  - payment_id: uuid
  - subscription_id: uuid
  - user_id: uuid
  - method: enum(wire_transfer, card)
  - status: enum(pending, verified, rejected)
  - proof_path: string
  - metadata: json
  - created_at, verified_at

## Relationships
- profiles 1..* addresses
- profiles 1..* subscriptions
- subscriptions 1..1 plans
- subscriptions 1..* payments

## Validation Rules
- district must belong to `DELIVERY_DISTRICTS` (Sharjah districts)
- uploads must respect `ALLOWED_UPLOAD_TYPES` and `MAX_UPLOAD_SIZE`
- priceReference keys must resolve to PO-signed numeric values before checkout is enabled
 - priceReference keys must resolve to runtime numeric values from Supabase before checkout is enabled. The repository includes `local files/Existing DB tables.txt` which documents the existing `plans` table (contains `base_price_aed`, `discounted_price_aed`). Do NOT hardcode prices in code or migrations.

Subscription lifecycle notes
- Subscriptions are monthly. A subscription becomes active 24 hours after receiving the subscription fees. Cancellation prevents future renewals but does not imply refunds (handled offline).

Proofs & retention (decision)
- Payment proofs are stored in database-backed storage (the `payments.receipt_url` field points to a DB-managed storage location). There is no date restriction enforced by the webapp; retention and archival are handled externally by accounting/ops. The webapp must ensure proofs are stored securely, access-controlled, and served via short-lived signed URLs for admin review when displayed in the admin UI.

````
