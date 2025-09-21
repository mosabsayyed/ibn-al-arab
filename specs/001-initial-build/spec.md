# Project Specification: Ibn Al Arab

This project is a subscription-only weekly meal delivery web application, built with a focus on two key messages: **Healthy Meals** and **Customer Convenience**.

## Core Functionality:
*   **User Authentication:** Users can sign up and log in.
*   **Main Landing Page:** A single, responsive page for both mobile and desktop that displays:
    *   A hero section with a headline and call-to-action buttons.
    *   A list of available meal plans. The product being sold is the **meal plan subscription**, not individual meals.
    *   A gallery of meals included in the plans, featuring detailed nutrition facts for each meal, carefully calculated based on the USDA Database.
*   **Meal Plans:** Users can view different subscription plans, each with its own title, delivery details, and price.
*   **Checkout Flow:**
    *   Users can select a plan and proceed to a checkout page.
    *   If not authenticated, the user will be prompted to log in or sign up, and will then be returned to the checkout.
    *   The checkout will calculate subtotal, VAT, and total based on PO-provided numbers.
*   **Payment Methods:** The system will support two payment methods:
    1.  **Credit Card:** This option will be present in the UI but visually dimmed/disabled and clearly labeled **"Coming Soon"** for the initial launch.
    2.  **Wire Transfer:** This will be the primary payment method at launch. When a user uploads a proof of payment, a `subscription` record is created with a `pending` status, awaiting admin approval.
*   **User Profile:** Authenticated users can view their profile and manage their delivery addresses.
*   **Admin Workflow:** Authorized admins must have an interface to review pending payments (especially wire transfer proofs), and then approve or reject the associated subscriptions.

## Key Constraints & Features:
*   **Localization:** The entire application must support English (`en`) and Arabic (`ar`), including right-to-left (RTL) layout for Arabic. **The default language for all users is Arabic (`ar`)**.
*   **Delivery Area:** Delivery is restricted to the city of **Sharjah**. To enforce this, the address form will require users to select their district from a predefined list of Sharjah districts before providing their specific address in a free-form text field.
*   **Data Model:** The application will use the following core entities: `profiles`, `plans`, `addresses`, `subscriptions`, and `payments`.
