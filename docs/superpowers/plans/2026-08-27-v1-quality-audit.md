# V1 Quality Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an evidence-backed, complete defect inventory for the deployed V1 across code, visual design, content, logic, and every public page, then turn the confirmed findings into an exact remediation plan.

**Architecture:** Run the audit from a fresh `audit/v1-quality-round-1` branch created after the hardening release reaches `main`. Keep audit findings in focused documents and local visual evidence in the ignored SDD workspace; no production code changes occur until the final synthesis has converted confirmed findings into a separate TDD remediation plan.

**Tech Stack:** Git, Node.js `>=22.12 <25`, npm, TypeScript, ESLint, Vitest, Playwright, Chromium, GitHub Pages, authoritative web sources

**Spec:** `docs/superpowers/specs/2026-08-27-v1-quality-audit-design.md`

## Global Constraints

- Preserve the existing visual direction, information architecture, primary colors, and page set.
- Audit widths are exactly 360, 390, 768, 1024, and 1440 pixels.
- Authoritative content sources are Shanghai University official sources, formal academic/publication records, national institutions, and established formal media; search summaries, encyclopedias, and self-media are discovery aids only.
- Do not infer facts, invent activity results, generate historical archive images, or convert `planned`/`collecting` records to published without evidence.
- Do not modify production code during this audit plan; confirmed defects are implemented through the follow-on remediation plan.
- Do not commit screenshots, browser caches, build output, source-library originals, or local absolute paths.

---

### Task 1: Establish the Audit Baseline and Repository Inventory

**Files:**
- Create: `docs/audits/2026-08-27-v1/baseline.md`
- Read: `package.json`
- Read: `vite.config.ts`
- Read: `playwright.config.ts`
- Read: `src/app/router.tsx`
- Read: `.gitignore`

**Interfaces:**
- Consumes: the stage-one deployed `main` SHA and public Pages URL.
- Produces: a route, file, asset, branch, test, and environment baseline used by every later audit task.

- [ ] **Step 1: Create a clean audit branch from updated main**

```powershell
git switch main
git pull --ff-only
git switch -c audit/v1-quality-round-1
```

Expected: the branch starts at the exact deployed stage-one SHA.

- [ ] **Step 2: Capture repository and runtime evidence**

Run:

```powershell
git status --short --branch
git ls-files | Measure-Object
git grep -n -E 'TODO|FIXME|HACK|XXX' -- src tests docs
npm ci
npm run check
npx playwright test
```

Expected: exact file count, a clean baseline, and recorded pass/fail evidence for every quality gate. Any failure is recorded verbatim rather than silently repaired.

- [ ] **Step 3: Write the baseline document**

Use this exact structure:

```markdown
# V1 Quality Audit Baseline

## Revisions
- Local main SHA:
- Remote main SHA:
- Pages workflow URL:
- Site URL:

## Runtime
- Node:
- npm:
- Browser:

## Quality Gates
| Gate | Command | Exit | Evidence |
|---|---|---:|---|

## Route Inventory
| Route | Page | Deep-link required | Dynamic states |
|---|---|---|---|

## Asset Inventory
| Group | Referenced | Present | Missing | Notes |
|---|---:|---:|---:|---|

## Repository Hygiene
| Check | Result | Evidence |
|---|---|---|
```

Populate every cell with observed values or `None observed`; do not leave blank cells.

- [ ] **Step 4: Commit the baseline**

```powershell
git add docs/audits/2026-08-27-v1/baseline.md
git commit -m 'docs: record V1 audit baseline'
```

### Task 2: Audit Code and Application Logic

**Files:**
- Create: `docs/audits/2026-08-27-v1/code-logic-findings.md`
- Read: `src/**/*.ts`
- Read: `src/**/*.tsx`
- Read: `scripts/**/*.ts`
- Read: `tests/**/*.ts`
- Read: `.github/workflows/*.yml`

**Interfaces:**
- Consumes: the Task 1 route inventory and quality-gate evidence.
- Produces: reproducible code and logic findings with severity, exact location, proof, and recommended regression boundary.

- [ ] **Step 1: Run focused static inventories**

```powershell
rg -n "TODO|FIXME|HACK|XXX|console\.(log|warn|error)|@ts-ignore|eslint-disable|as unknown as" src scripts tests .github
rg -n "window\.|document\.|localStorage|sessionStorage|requestAnimationFrame|IntersectionObserver|addEventListener" src
rg -n "href=|target=|rel=|navigate\(|setSearchParams|showModal|close\(" src
rg -n "'/images/|\"/images/|'/logo|\"/logo|og-cover" src index.html public
```

Expected: every match is classified as safe, defect, redundancy, or test-only usage.

- [ ] **Step 2: Inspect dependency and module boundaries**

For each production module, record:

```text
- exported values and their consumers
- duplicated normalization/validation logic
- unreachable status or route branches
- production files with no importer
- large components mixing unrelated responsibilities
- cleanup obligations for observers, events, animation frames, and dialogs
- unsafe URL, HTML, or storage boundaries
```

Use `rg` and TypeScript references to prove each unused or duplicated claim; do not classify a file as redundant from filename alone.

- [ ] **Step 3: Exercise core logic mutations**

Temporarily introduce and then restore these mutations one at a time:

```text
- remove Pages base prefixing from one public image
- allow a javascript: media URL
- drop one scientist or one spirit relationship from the mobile graph list
- replace history-pushing filter updates with replace semantics
- skip observer or animation-frame cleanup
```

Run the named covering tests after each mutation. Record whether the suite fails for the intended reason. Restore the source after every mutation and confirm `git diff` returns to the audit baseline.

- [ ] **Step 4: Write the code and logic findings document**

Use one section per finding:

```markdown
## CL-001 — Concise title
- Severity: Critical | Important | Minor
- Location: `path:line`
- Reproduction:
- Expected:
- Actual:
- Evidence:
- Regression test boundary:
- Recommended smallest fix:
```

If a category has no defect, add a `No defect observed` section with the commands and files checked.

- [ ] **Step 5: Commit the findings**

```powershell
git add docs/audits/2026-08-27-v1/code-logic-findings.md
git commit -m 'docs: audit V1 code and logic'
```

### Task 3: Audit Content Against Authoritative Sources

**Files:**
- Create: `docs/audits/2026-08-27-v1/content-findings.md`
- Read: `src/content/scientists.ts`
- Read: `src/content/timeline.ts`
- Read: `src/content/spiritThemes.ts`
- Read: `src/content/activities.ts`
- Read: `src/content/media.ts`
- Read: `src/content/sources.ts`
- Read: `docs/content-guide.md`

**Interfaces:**
- Consumes: all published copy and the existing source registry.
- Produces: a field-level fact audit with direct source URLs, source type, access date, confidence, and exact proposed correction text.

- [ ] **Step 1: Build the fact checklist**

Audit all eight scientists and extract every claim in these categories:

```text
name; birth/death years; institution and role; discipline; education; named research result; award; dated timeline event; quotation; archive caption; spirit-theme relationship
```

Also audit all activity and media records for status, date, venue/platform, image caption, URL, and whether the page action matches the status.

- [ ] **Step 2: Research each claim using approved sources**

Use the `firecrawl-search` skill for discovery and full-page extraction. For technical or academic claims, prefer official institutional pages and primary publication records. Store only direct supporting URLs, not search-result URLs.

For each claim, assign:

```text
Verified — direct authoritative support matches the website
Correction — authoritative support contradicts the website
Insufficient — no suitable support found; retain conservative wording or collecting state
Conflict — authoritative sources disagree; record both and do not silently choose
```

- [ ] **Step 3: Check wording and internal consistency**

Compare repeated names, dates, achievements, theme labels, calls to action, and status wording across all pages. Record copy errors including punctuation, inconsistent terminology, ambiguous pronouns, unsupported superlatives, and statements that imply a planned activity has occurred.

- [ ] **Step 4: Write the content findings document**

Use this exact table:

```markdown
| ID | Entity/page | Current claim | Verdict | Proposed text | Source URL | Source type | Accessed | Confidence |
|---|---|---|---|---|---|---|---|---|
```

Every `Correction` row must include replacement wording and a direct source. Every `Insufficient` or `Conflict` row must state whether the current wording remains, is narrowed, or should be removed.

- [ ] **Step 5: Commit the findings**

```powershell
git add docs/audits/2026-08-27-v1/content-findings.md
git commit -m 'docs: audit V1 content sources'
```

### Task 4: Audit Every Page Visually and Interactively

**Files:**
- Create: `docs/audits/2026-08-27-v1/visual-page-findings.md`
- Create locally ignored: `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/`
- Read: `src/pages/*.tsx`
- Read: `src/styles/*.css`
- Read: `tests/e2e/*.spec.ts`

**Interfaces:**
- Consumes: Task 1 route inventory and the deployed/local production build.
- Produces: viewport-specific visual and page findings with screenshots, DOM evidence, console evidence, and reproducible interaction steps.

- [ ] **Step 1: Start a production preview from a clean build**

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 43179
```

Expected: one production preview with no missing-resource warning.

- [ ] **Step 2: Capture every route at every required width**

Use the `browser:control-in-app-browser` skill or Playwright Chromium. Check widths 360, 390, 768, 1024, and 1440; use 844px mobile height and 900px desktop height.

For each route, record:

```text
- viewport and route
- page title and H1
- horizontal overflow delta
- clipped/overlapping text or controls
- image natural size, rendered size, aspect ratio, alt text, and load result
- color contrast or focus-visibility concern
- console.error, pageerror, and failed same-origin requests
- keyboard path and focus restoration for interactive controls
```

- [ ] **Step 3: Exercise required dynamic states**

Capture and inspect:

```text
- mobile menu closed/open/keyboard-dismissed
- gallery filters, empty result, reset, and Back restoration
- timeline and spirit-theme selections
- graph visual/list modes and all eight people/six themes
- archive dialog open, native cancel, close button, and focus return
- planned activities and collecting media empty/action states
- image failure fallbacks
- unknown route and direct deep-link refresh
- reduced-motion final states
```

- [ ] **Step 4: Compare local and deployed behavior**

Repeat homepage, three scientist profiles, graph, media, and one unknown route on `https://gauntwheelcake.github.io/shu-scientist-museum/`. A discrepancy is recorded separately as deployment-only, cache-related, or local-only.

- [ ] **Step 5: Write the visual and page findings document**

Use one section per finding:

```markdown
## VP-001 — Concise title
- Severity: Critical | Important | Minor
- Routes:
- Viewports:
- Reproduction:
- Expected:
- Actual:
- Screenshot evidence:
- DOM/network/console evidence:
- Recommended smallest fix:
```

Add a route-by-viewport matrix marking every inspected cell `Pass` or listing its finding IDs.

- [ ] **Step 6: Commit the textual findings only**

```powershell
git add docs/audits/2026-08-27-v1/visual-page-findings.md
git commit -m 'docs: audit V1 visual and page quality'
```

Expected: local screenshots remain ignored and absent from the commit.

### Task 5: Synthesize Findings and Produce the Remediation Plan

**Files:**
- Create: `docs/audits/2026-08-27-v1/summary.md`
- Create: `docs/superpowers/plans/2026-08-27-v1-audit-remediation.md`
- Read: all four audit documents created by Tasks 1–4

**Interfaces:**
- Consumes: every confirmed code, content, visual, logic, and page finding.
- Produces: one deduplicated audit summary and a TDD implementation plan containing exact files, tests, source changes, visual evidence, and release steps for every accepted finding.

- [ ] **Step 1: Deduplicate and rank findings**

Merge findings that share one root cause. Rank them with this release policy:

```text
Critical — site unavailable, false/misleading core fact, unsafe execution, or inaccessible primary navigation
Important — broken route/state/resource, significant responsive or accessibility failure, unsupported published claim, or deployment inconsistency
Minor — polish, low-impact redundancy, wording improvement, or non-blocking test gap
```

- [ ] **Step 2: Write the audit summary**

Use this exact structure:

```markdown
# V1 Quality Audit Summary

## Executive result
## Critical findings
## Important findings
## Minor findings
## Verified areas with no defect observed
## Content retained because evidence is insufficient or conflicting
## Team-supplied material still required
## Recommended release scope
```

Every finding references its detailed audit ID. Empty severity sections state `None observed`.

- [ ] **Step 3: Write the exact remediation implementation plan**

Invoke `superpowers:writing-plans` and create `docs/superpowers/plans/2026-08-27-v1-audit-remediation.md`. Each task must name exact files and finding IDs, include the failing test or visual/content evidence step, the smallest implementation, focused verification, independent review, commit message, full-suite gate, and Pages release verification. Do not include findings classified as `Insufficient` or `Conflict` unless the planned change only narrows or removes unsupported wording.

- [ ] **Step 4: Self-review both documents**

```powershell
rg -n "TBD|TODO|implement later|fill in|待定" docs/audits/2026-08-27-v1/summary.md docs/superpowers/plans/2026-08-27-v1-audit-remediation.md
git diff --check
```

Expected: no placeholder or whitespace error; every accepted finding appears in exactly one remediation task.

- [ ] **Step 5: Commit the synthesis and remediation plan**

```powershell
git add docs/audits/2026-08-27-v1/summary.md docs/superpowers/plans/2026-08-27-v1-audit-remediation.md
git commit -m 'docs: plan V1 audit remediation'
```

Expected: the audit branch contains documentation and evidence only; production code remains identical to the stage-one deployed `main` until remediation execution begins.
