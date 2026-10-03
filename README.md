# Agentic End-to-End QA Workflow

An example of using specialized AI agents, Playwright, and MCP browser tools to turn a user story into a reviewed test plan, exploratory findings, automated end-to-end tests, and an execution report.

The sample project applies this workflow to **SCRUM-101**, an e-commerce checkout story tested against the public SauceDemo application. It demonstrates QA automation and reporting; it does not implement the application itself.

## Agentic QA workflow

The workflow is defined in [QAEnd2EndPromptFile.md](QAEnd2EndPromptFile.md) and proceeds in reviewable stages:

1. **Understand the story** — read the acceptance criteria, business rules, test account, and application URL.
2. **Plan coverage** — the `playwright-test-planner` agent turns requirements into scenarios for happy paths, validation, boundaries, navigation, and UI behavior.
3. **Explore the application** — use Playwright MCP browser tools to exercise scenarios, verify actual behavior, and collect evidence.
4. **Generate tests** — the `playwright-test-generator` agent creates Playwright tests using selectors and behavior confirmed during exploration.
5. **Execute and heal** — run the tests across configured browsers; use the `playwright-test-healer` agent to diagnose and repair automation failures without hiding product defects.
6. **Report** — document execution status, findings, defect evidence, acceptance-criteria coverage, and remaining risks.
7. **Review and publish** — inspect the artifacts and Git diff, then commit and push through the repository's normal review and security process.

The agents are defined under `.github/agents/`. Human review is important: agents can propose coverage and code, but observed behavior must be compared with the story, and known defects must not be reported as passing acceptance criteria.

## Quick start

Requirements: Node.js, npm, and the browser engines used by the Playwright configuration.

```sh
npm install
npx playwright install chromium firefox webkit
```

Run the checkout suite in all configured projects:

```sh
npx playwright test tests/saucedemo-checkout
```

Run only Chromium:

```sh
npx playwright test tests/saucedemo-checkout --project=chromium
```

Open the HTML report after a run:

```sh
npx playwright show-report
```

## Project artifacts

- `user-stories/SCRUM-101-ecommerce-checkout.md` — story, acceptance criteria, and business rules.
- `specs/saucedemo-checkout-test-plan.md` — scenario-based test plan.
- `tests/saucedemo-checkout/` — Playwright tests and shared checkout helpers.
- `test-results/SCRUM-101-checkout-test-report.md` — manual and automated execution summary, defects, and coverage analysis.
- `.github/agents/` — planner, generator, and healer agent instructions.
- `playwright.config.ts` — Chromium, Firefox, and WebKit project configuration.

## MCP and credential safety

Configure browser and other MCP servers locally in VS Code. Keep `.vscode/mcp.json`, `.env` files, access tokens, and generated browser logs out of commits. Use VS Code input variables for secrets or a securely managed environment; never paste a token into source files, prompts, issues, or commits. The workspace `.gitignore` excludes local MCP configuration and generated artifacts.

## Current sample findings

The checkout happy path and required-field validation were exercised. The report also records observed gaps, including a missing cart total, checkout with an empty cart, permissive malformed input, and overview cancellation returning to inventory instead of the cart. Some automation cases intentionally characterize these current behaviors; a passing characterization test does **not** mean the corresponding requirement is satisfied.
