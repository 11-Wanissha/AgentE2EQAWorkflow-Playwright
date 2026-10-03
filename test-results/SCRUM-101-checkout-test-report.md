# SCRUM-101 Checkout QA Execution Report

**Application:** SauceDemo — https://www.saucedemo.com  
**Run date:** 2026-10-03  
**Account:** `standard_user` (password omitted from report)  
**Automation:** Playwright Test 1.63, Chromium, Firefox, WebKit

## Executive summary

- **Planned:** 18 test scenarios in [the SCRUM-101 test plan](../specs/saucedemo-checkout-test-plan.md).
- **Automated:** 13 test cases, run against Chromium, Firefox, and WebKit (39 executions).
- **Automation result:** 39/39 passed; 0 failed.
- **Important qualification:** Three tests per browser are characterization checks that intentionally pass when a known acceptance/business-rule defect is reproduced (malformed data accepted, empty cart allowed, and overview Cancel returns to inventory). Therefore, green automation does **not** mean all acceptance criteria pass. These three behaviors remain defects/open requirements.
- **Manual exploratory checks:** Completed login, cart review, required-field rejection, standard valid checkout, overview totals, successful order completion, and cart-clearing checks. Screenshots were captured in the interactive browser session for cart, overview, and confirmation, but are not persisted as files in this workspace.
- **Overall quality:** Core happy-path checkout is functional. Do not consider SCRUM-101 fully accepted until the cart total and the empty-cart, input-validation, and cancel-navigation gaps are resolved or requirements are clarified.

## Manual exploratory results

| Check | Result | Observation |
|---|---|---|
| Login with supplied standard account | PASS | Reached Products inventory. |
| Review two cart items | PASS / GAP | Backpack and Bike Light showed correct names, descriptions, quantity 1, and prices ($29.99 and $9.99). Cart had Continue Shopping and Checkout. No cart total calculation was shown, contrary to AC1. |
| Required information validation | PASS | Blank submission showed `Error: First Name is required`; automated checks independently verified the Last Name and Postal Code errors and blocked progression. |
| Valid checkout information and overview | PASS | Overview listed both items, SauceCard #31337, Free Pony Express Delivery!, item total $39.98, tax $3.20, and total $43.18. |
| Finish order and Back Home | PASS | Confirmation showed “Thank you for your order!” and dispatch copy; the cart was empty after completion. |
| Malformed name/postal input | FAIL — DEF-103 | Special-character names (`@#$`, `!!!`) and alphabetic postal code (`abc`) were accepted and advanced. The story does not specify exact valid formats; agree policy with product before fixing/asserting detailed format constraints. |
| Empty-cart checkout | FAIL — DEF-102 | Checkout remained available after removing all items; valid details reached overview with zero totals. |
| Cancel from overview | FAIL — DEF-104 | Cancel returned to Products inventory instead of the cart; cart items remained. |
| Mobile layout | PASS with usability note | At 390px width checkout remained operable and had no horizontal overflow in automation. The long overview requires vertical scrolling, which is acceptable if actions remain reachable. |

## Automated results

Executed with `npx playwright test tests/saucedemo-checkout --project=chromium`, then `npx playwright test tests/saucedemo-checkout --project=firefox --project=webkit`.

| Project | Passed | Failed | Notes |
|---|---:|---:|---|
| Chromium | 13 | 0 | Includes three known-defect characterization tests. |
| Firefox | 13 | 0 | Includes three known-defect characterization tests. |
| WebKit | 13 | 0 | WebKit engine coverage; not a branded Safari installation test. |
| **Total** | **39** | **0** | 39 executions of 13 unique test cases. |

**Healing:** No failures occurred, so no test healing was required. Tests use isolated Playwright contexts, stable UI locators, and assertions for observed behaviors. Characterization tests are explicitly named as known defects rather than presenting those behaviors as requirement-compliant.

Automated coverage includes login/direct logged-out navigation, product and cart details, Continue Shopping, required fields and correction flow, malformed input behavior, empty-cart behavior, overview details/totals, overview cancellation, order completion/cart clearing, and 390px responsive smoke. The remaining plan scenarios are not yet automated or fully executed, including broader postal/name boundaries and accessibility/keyboard coverage, additional mobile width, and back/forward/refresh state behavior.

## Defects and requirement gaps

| ID | Severity | Title | Expected | Actual / reproduction | Evidence |
|---|---|---|---|---|---|
| DEF-101 | Medium | Cart total is missing | AC1 requires a total calculation in Cart. | Add Backpack and Bike Light and open Cart; item prices are present but no subtotal/total summary appears. | Manual cart screenshot captured in session; automated absence check. |
| DEF-102 | High | Empty cart can enter checkout | Business Rule 3 says an empty cart cannot proceed. | Add item(s), remove all, click Checkout, submit valid details; overview opens with $0.00 totals. | Automated characterization in all three projects. |
| DEF-103 | Medium / clarification required | Malformed checkout values are accepted | AC5 expects invalid data to be rejected with a clear validation error. | Enter `@#$`, `!!!`, and `abc`; Continue opens overview. Product must define permitted name and postal formats/limits. | Manual exploration and automated characterization in all three projects. |
| DEF-104 | Medium | Overview Cancel navigates to inventory | Business Rule 5 says cancel returns to Cart. | From Overview click Cancel; Products inventory opens; cart remains populated. | Automated characterization in all three projects. |

## Acceptance-criteria coverage

| Criterion | Coverage | Status |
|---|---|---|
| AC1 — Cart review/details/total/navigation | Manual and automated product details, quantities, prices, and controls; cart total absence explicitly checked. | Partial / FAIL: total missing (DEF-101). |
| AC2 — Checkout fields and required validation | Automated checks for each missing field and correction path; manual blank submission. | PASS for required-field validation. |
| AC3 — Overview and totals | Manual and automated two-item items, payment, shipping, tax, total, Cancel, and Finish checks. | PASS for overview contents/totals. Cancel route separately fails Business Rule 5 (DEF-104). |
| AC4 — Completion | Manual and automated confirmation, Back Home, cart clearing. | PASS. |
| AC5 — Invalid values | Manual and automated malformed values. | FAIL / needs precise format rules (DEF-103). |

## Recommendations and next steps

1. Add a cart subtotal/total presentation, or clarify the intended meaning of “total price calculation” at the cart stage.
2. Disable or block Checkout for an empty cart and add a regression test that asserts rejection rather than characterizes the defect.
3. Define accepted name/postal formats and boundaries; implement field-specific errors, including whitespace-only and invalid values, then replace DEF-103 characterization with requirement assertions.
4. Route Cancel from each checkout step back to Cart per Business Rule 5 and preserve items; replace the characterization with a requirement assertion.
5. Complete the remaining planned boundary, keyboard/accessibility, back/forward/refresh, and 320px mobile checks before marking the story Done.
6. Persist screenshot evidence in the repository on a future run. The screenshots captured in this session are visible in the conversation but were not saved as workspace files.

## Commit status

The workspace directory did not contain a `.git` repository or a configured remote, so the local test artifacts were not committed or pushed as part of this run. Do not interpret this report as a successful Git delivery.
