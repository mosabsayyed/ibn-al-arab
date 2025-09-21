# Data Model — 001-initial-build

Core entities
-------------

- `profiles` — user profiles, basic contact info, language preference, and roles (user, admin).
- `plans` — subscription plans (title, description, delivery cadence, metadata, priceReference snapshot key). Prices are runtime-configured; no numeric price seeds committed.
 - `plans` — subscription plans (title, description, delivery cadence, metadata, priceReference snapshot key). Prices are runtime-configured in Supabase tables (see `local files/Existing DB tables.txt`) and no numeric price seeds should be committed.
- `addresses` — user addresses; requires `district` from Sharjah districts list and a `details` free-form field.

 Subscription lifecycle notes:
 - Subscriptions are monthly. A subscription becomes active 24 hours after receiving subscription fees. Cancellation prevents future renewals but does not imply refunds.

 Proofs & retention note:
 - Payment proofs are stored in database-backed storage (see `payments.receipt_url` in DB). The webapp does not enforce a retention date; accounting/ops manage retention and archival outside the webapp. The webapp must serve proofs via short-lived signed URLs for admin review and ensure proper access controls.
- `subscriptions` — subscription records: `id`, `profile_id`, `plan_id`, `status` (pending, active, cancelled), `price_snapshot`, `payment_method`, `proof_url` (private storage path), `created_at`, `updated_at`.
- `payments` — payment records for wire transfers and future card payments: `id`, `subscription_id`, `amount`, `currency`, `status`, `provider_reference`, `created_at`.

Validation rules
----------------

- `addresses.district` must be one of Sharjah districts.
- `plans` must reference a `priceReference` string that maps to runtime config; do not store canonical numeric price in code.
- Uploaded proofs must be stored in private buckets and served via signed URLs with short TTLs.

Security
--------

- Enforce RLS on `profiles`, `payments`, and any PII tables.
- Storage: proofs in private bucket; admin operations require service role with minimal exposure.
