# Main Page Specification — Ibn Al Arab

Last updated: 2025-09-21

Purpose: This document defines the exact behavior, data contracts, and acceptance criteria for the single main page (the landing page) that contains the hero, plans list, and meals gallery. The main page is the primary conversion surface for selecting a plan and navigating to the checkout.

Structure and components
- `Hero` (top section)
  - Headline: localized `healthyTastyHome` key.
  - Subheadline: localized `tagline` and `monthlySubscriptionTagline` keys.
  - CTAs: anchor `#plans` and `#gallery` — verbs should come from translations.

- `MealPlanPreview` (component: `client/components/sections/MealPlanPreview.tsx`)
  - Data source: `shared/data/plans.ts` (object shape defined below).
  - Render: grid of card components (one per plan).
  - Contract: component must accept `Plan` objects with the following properties (no numeric seeds in spec file):
    - `id` (slug)
    - `titleEn`, `titleAr`
    - `days` (delivery days count)
    - `mealsPerDay` (meals per delivery day)
    - `priceReference` (placeholder key that identifies price value source)
    - `studentPriceReference` (placeholder key)
    - `discountLabel` (localized string like `~12%` displayed as a label only)
  - Visual: each card shows primary plan title, delivery details, price area (original price strikethrough + discounted price block), discount label, chef illustration image loaded from `/{plan.id}.png`.
  - Behavior: clicking `Subscribe` navigates to `/checkout?plan={planId}`.
  - Data rules: runtime must provide numeric values for `priceReference` and `studentPriceReference` from a PO-approved config or server call. If missing, the component must render a clear configuration error in UI (do not silently use defaults).

- `MealsGallery` (component: `client/components/sections/MealsGallery.tsx`)
  - Data source: `shared/data/meals` (must provide `name`, `image`, `description`, `ingredients`, `nutritionData` per locale).
  - Tabs: `description`, `ingredients`, `nutrition` with accessible keyboard navigation.
  - Image fallback: use a placeholder image if `meal.image` is falsy.

Data contracts
- `Plan` (runtime object) — fields and types
  - `id: string` (slug)
  - `title: { en: string, ar: string }` or `titleEn/titleAr` as alternate fields
  - `days: number`
  - `mealsPerDay: number`
  - `priceReference: string` (key used to fetch numeric price from secure config)
  - `studentPriceReference: string` (same contract as above)
  - `discountLabel: string` (UI-only label)

- `Meal` (runtime object)
  - `name: { en: string, ar: string }`
  - `image: string | null`
  - `description: { en: string, ar: string }`
  - `ingredients: { en: string, ar: string }`
  - `nutritionData: { en: string, ar: string }`

Page interactions and UX
- Navigation
  - Hero CTAs anchor to `#plans` and `#gallery`.
  - `Subscribe` → `/checkout?plan={planId}` (must preserve locale when redirecting).
  - `Profile` link in header → `/profile` (visible when authenticated).

- Authentication gating
  - If user clicks `Subscribe` and is not authenticated, the app should prompt for login/signup and return the user to the checkout for the selected plan after successful auth.

- Pricing display
  - `MealPlanPreview` shows price information using runtime numeric values fetched using `priceReference`.
  - The UI displays original price (line-through) and discounted student price in a prominent block.
  - If numeric values or the VAT_RATE config are missing, show a notice: "Pricing not configured — please contact support or admin." and block proceeding to checkout.

Accessibility & localization
- `dir` must be set to `rtl` when locale is `ar` and `ltr` when locale is `en`.
- All interactive controls must have accessible labels and keyboard focus styles.

Acceptance criteria
- Main page renders hero, plans (one per `Plan` object), and gallery without JS errors.
- Clicking `Subscribe` for a plan navigates to `/checkout?plan={planId}`.
- If numeric pricing config missing, UI shows explicit error and disables subscription CTA.
- Meals gallery tabs are keyboard navigable and localized.

Developer notes
- `MealPlanPreview` currently imports `PLANS` from `shared/data/plans.ts`. For the fresh repo, prefer fetching runtime plan metadata (including numeric references) from a secure server or admin-managed config at runtime rather than compile-time constants.
