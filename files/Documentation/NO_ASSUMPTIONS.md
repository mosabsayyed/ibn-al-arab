# NO_ASSUMPTIONS — Developer Guardrails

Purpose: Prevent accidental inclusion of business-critical numeric constants (prices, VAT, region lists) or sample seeds that can cause failures when a new repository is scaffolded from this spec.

Rules
1. No hard-coded numeric business constants
   - Do not commit any numeric constants that represent business values (prices, VAT percent, billing cycles) without a PO signoff. If a constant must be present for local dev, it must be prefixed with `DEV_` and documented in `README.dev.md`.

2. No seed INSERTs for plans
   - Do not commit SQL files that contain `INSERT INTO public.plans VALUES(...)`. Seeds must be created by the admin tooling or a protected seed script that requires interactive confirmation.

3. Placeholder markers
   - When a placeholder is present in code or config, include this exact marker in the same file: `PRODUCT_SIGNOFF_REQUIRED`. CI will look for this marker.

4. Pre-commit checks
   - Add a pre-commit hook that scans diffs for patterns and rejects the commit if detected. The patterns include:
     - `\bFIXME_PRICE\b`
     - `\bHARDCODED_VAT\b`
     - `INSERT INTO public.plans` with `VALUES`
     - Numeric currency-like literals near identifiers `price`, `vat`, `AED`, `currency`

5. CI gates
   - On PR: run `pnpm lint && pnpm typecheck && pnpm test` plus a grep check for the placeholder patterns in the diff; fail the job if matches found.

6. Admin signoff process
   - Before enabling any live checkout or seeding numeric values, a `CONFIG.md` file must be added to the repo root or an admin UI must be used. The `CONFIG.md` must include:
     - `CURRENCY`: the currency code to use.
     - `VAT_RATE`: the tax rate.
     - `PLAN_PRICES`: a mapping of plan-slug to numeric value (no sample here; PO to add).
     - `MAX_UPLOAD_SIZE`, `ALLOWED_UPLOAD_TYPES`, `DELIVERY_DISTRICTS`.
   - `CONFIG.md` updates must include the `PRODUCT_SIGNOFF_REQUIRED` marker and explicit PO/approver name and timestamp.

7. Local dev notes
   - Developers may use `env.local.example` with `DEV_`-prefixed placeholders to run the app locally. These values must not be committed to `main`.

Verification script (suggested)
 - A small script `scripts/check-no-assumptions.sh` should exit non-zero if forbidden patterns are found. (If you want, I can add this script.)

Enforcement
 - The organization must enable CI checks and pre-commit hooks and require at least one PO reviewer for PRs touching pricing-related files.
