# SCRUM-101 SauceDemo Checkout Test Plan

## Application Overview

Comprehensive manual and automation-ready test plan for SCRUM-101 checkout at https://www.saucedemo.com. Test account: standard_user / secret_sauce. Covers AC1–AC5 and business rules, with deterministic cart/product data, validation, navigation, responsive UI, accessibility, and cross-browser checks. Exploration observed acceptance gaps: cart has no displayed total; empty-cart checkout is permitted and reaches $0.00 overview; malformed non-empty data is accepted; overview Cancel returns to inventory instead of cart. These are expected-failure/defect checks, not changes to the stated requirements.

## Test Scenarios

### 1. Authentication, cart review, and navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful login and direct checkout requires authentication

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. Open the application, sign in with standard_user / secret_sauce, then in a fresh logged-out context directly open /checkout-step-one.html.
    - expect: Valid credentials open Products inventory.
    - expect: Logged-out direct checkout is redirected to login or denied; checkout form/cart data is not exposed.

#### 1.2. Cart review shows each selected product and details

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99); open the cart.
    - expect: Cart badge shows 2 items.
    - expect: Both product rows show correct name, description, price, and quantity 1.
    - expect: Continue Shopping and Checkout controls are present.
    - expect: Check AC1 total calculation; report missing cart total as a requirement gap if still absent (observed during exploration).

#### 1.3. Continue Shopping preserves cart contents

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. From a cart containing Backpack and Bike Light, choose Continue Shopping; return to the cart.
    - expect: Products page opens.
    - expect: Cart badge and both rows remain unchanged after returning.

#### 1.4. Empty cart cannot proceed to checkout

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. Add one item, open cart, remove the item, inspect empty state, and attempt checkout/progression if controls remain available.
    - expect: Cart is empty and badge reflects empty state.
    - expect: Checkout is unavailable or progression blocked under Business Rule 3.
    - expect: Observed: Checkout remained enabled; valid details advanced to overview with no items and $0.00 subtotal/tax/total. Log as a business-rule defect if reproduced.

#### 1.5. Cancel from information returns to cart without losing items

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. With one cart item, open checkout, enter partial details, select Cancel.
    - expect: User returns to cart, not order confirmation.
    - expect: Item remains in cart and no order is placed.

#### 1.6. Browser Back and Forward maintain safe checkout state

**File:** `tests/saucedemo-checkout/auth-and-cart.spec.ts`

**Steps:**
  1. Navigate cart → information → overview; use browser Back to revisit information and cart and Forward to revisit checkout. Refresh pages once.
    - expect: No order is accidentally completed or duplicated.
    - expect: Cart persists until successful Finish; form/overview state is retained or resets consistently without stale totals/errors.
    - expect: Routes remain usable while logged in.

### 2. Checkout information validation and order overview

**Seed:** `tests/seed.spec.ts`

#### 2.1. Each required checkout field has specific validation

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Using a non-empty cart, make three fresh attempts: (1) submit all blank, (2) enter first name only, (3) enter first and last names but no postal code.
    - expect: Attempt 1 reports First Name is required.
    - expect: Attempt 2 reports Last Name is required.
    - expect: Attempt 3 reports Postal Code/Zip is required.
    - expect: Each failure remains on information page and cannot enter overview. Actual observed strings: 'Error: First Name is required', 'Error: Last Name is required', and 'Error: Postal Code is required'.

#### 2.2. Correcting required data removes stale errors and permits progress

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Trigger missing-field errors, correct the required field(s), and resubmit; repeat for each field.
    - expect: Validation error is cleared or updated to the next missing field.
    - expect: With all three fields populated, Continue opens Overview.

#### 2.3. Valid data advances to overview with accurate item and totals

**File:** `tests/saucedemo-checkout/checkout-overview.spec.ts`

**Steps:**
  1. Add Backpack ($29.99) and Bike Light ($9.99); submit Taylor / Morgan / 94105.
    - expect: Overview displays both item summaries, quantities, and prices.
    - expect: Payment Information and Shipping Information are visible.
    - expect: Item total $39.98, tax $3.20, total $43.18; total equals subtotal + tax.
    - expect: Cancel and Finish controls are visible.

#### 2.4. Malformed and whitespace-only information is rejected

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. With non-empty cart, submit names @#$ and !!! and postal code abc; separately try whitespace-only values and incomplete values.
    - expect: Invalid format/meaningless values produce clear field-specific errors and cannot proceed; required fields reject whitespace-only content.
    - expect: Observed exploration: @#$, !!!, and abc advanced to Overview without error. Record AC5 defect; story gives examples but does not define exact allowed character/format policy, so confirm intended validation with product owner.

#### 2.5. Boundary and international checkout data

**File:** `tests/saucedemo-checkout/checkout-validation.spec.ts`

**Steps:**
  1. Test one-character names; long names around and above reasonable limits; apostrophe, hyphen, and Unicode names; ZIP 94105, ZIP+4, alphanumeric international code, leading-zero ZIP, empty and overlong postal values.
    - expect: Valid supported values are accepted without truncation/corruption; unsupported or over-limit values show clear validation and block progression.
    - expect: Leading zero is preserved when allowed. Document that acceptable formats/maximum lengths are not specified by the story and obtain product agreement before asserting format-specific rules.

#### 2.6. Overview fixed payment/shipping data and one-/multi-item totals

**File:** `tests/saucedemo-checkout/checkout-overview.spec.ts`

**Steps:**
  1. Complete valid checkout information for Backpack alone, then Onesie ($7.99) plus Bike Light ($9.99); inspect overview values.
    - expect: Payment method/value and shipping method/value are present and readable.
    - expect: Backpack: subtotal $29.99, tax $2.40, total $32.39.
    - expect: Onesie + Bike Light: subtotal $17.98, tax $1.44, total $19.42.
    - expect: Product details match cart; amounts use correct currency rounding and total is subtotal + tax.

#### 2.7. Cancel from overview returns to cart without placing order

**File:** `tests/saucedemo-checkout/checkout-overview.spec.ts`

**Steps:**
  1. Reach Overview with a non-empty cart and select Cancel.
    - expect: No confirmation or completed order appears; cart products are retained.
    - expect: Business Rule 5 says cancellation returns to cart. Observed: Cancel returned to Products inventory. Log/verify as navigation defect.

### 3. Order completion, responsive UI, and compatibility

**Seed:** `tests/seed.spec.ts`

#### 3.1. Finish displays order confirmation

**File:** `tests/saucedemo-checkout/order-completion.spec.ts`

**Steps:**
  1. From Overview with a non-empty cart, select Finish.
    - expect: Checkout Complete page opens with 'Thank you for your order!' and dispatch confirmation copy.
    - expect: Back Home control is visible and enabled.

#### 3.2. Successful order clears cart and Back Home returns to products

**File:** `tests/saucedemo-checkout/order-completion.spec.ts`

**Steps:**
  1. After Finish, check the cart badge, use Back Home, and reopen cart.
    - expect: Cart is empty immediately after completion and remains empty after navigation.
    - expect: Back Home opens Products inventory; no stale items/count remain.

#### 3.3. Checkout supports keyboard and accessible interaction

**File:** `tests/saucedemo-checkout/ui-accessibility.spec.ts`

**Steps:**
  1. Complete cart → information → overview → confirmation using keyboard only; inspect focus, field names, errors, and controls.
    - expect: Controls are keyboard reachable/operable in a logical order with visible focus.
    - expect: First Name, Last Name, and Zip/Postal Code are programmatically identifiable.
    - expect: Validation is exposed as an alert and actionable; buttons have understandable names.

#### 3.4. Checkout layout is usable at mobile widths

**File:** `tests/saucedemo-checkout/responsive.spec.ts`

**Steps:**
  1. Run cart, information, overview, and completion flow at 390×844 and 320×568 viewports; inspect screenshots and scroll through each stage.
    - expect: All fields, order details, totals, and actions remain usable; vertical scroll is acceptable.
    - expect: No horizontal overflow, clipped/overlapping fields/buttons, or hidden checkout controls.
    - expect: Menu/cart/navigation and Back Home remain operable.

#### 3.5. Cross-browser checkout smoke

**File:** `tests/saucedemo-checkout/cross-browser.spec.ts`

**Steps:**
  1. Run happy path and missing-field validation on Chromium, Firefox, and WebKit desktop; run responsive smoke on Chromium mobile emulation and WebKit/iPhone emulation.
    - expect: Login, cart, required-field validation, totals, Finish, confirmation, and cart clearing work consistently.
    - expect: Record browser/engine/version/device and any layout/navigation differences. WebKit represents Safari's engine; validate on branded Safari separately if required.
