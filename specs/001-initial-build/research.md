# Research Notes — 001-initial-build

Summary
-------

This document captures Phase 0 research for the initial-build feature. The project is a subscription-only weekly meal delivery web app focused on Healthy Meals and Customer Convenience. The core constraints are Arabic-first localization, Sharjah-only delivery, and subscription-level pricing.

Decisions and rationale
-----------------------

- Default language: Arabic (`ar`) to honor product direction and primary audience. English (`en`) as fallback.
- Payment methods: wire transfer primary for launch; credit-card present in UI but dimmed/disabled as "Coming Soon".
- Delivery area constraint: restrict to Sharjah; enforce district selection in address form.
- Nutrition facts: use USDA FoodData Central as authoritative source for nutrition calculations; ensure per-meal nutrition is stored and versioned.
- Data platform: Supabase recommended (Auth + Postgres + Storage) with RLS and private buckets for proofs/PII.

Open questions
--------------

- Runtime business values (VAT, plan prices, currency) must be provided via admin UI or environment and guarded by `PRODUCT_SIGNOFF_REQUIRED` before merge.
 - Runtime business values (VAT, plan prices, currency) must be provided via admin UI or environment and guarded by `PRODUCT_SIGNOFF_REQUIRED` before merge. PO clarified: Pricing and plan values are stored in Supabase tables (already created; reference in `local files/Existing DB tables.txt`).
- Admin approval workflow for wire-transfer proofs: should include an audit log and signed URLs for private storage access.
