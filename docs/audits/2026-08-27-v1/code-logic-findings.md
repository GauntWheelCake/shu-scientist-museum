# V1 Code and Application Logic Audit

Audit revision: `5075388604745650dd399333c07a2ec9d0c2f8c1` on `audit/v1-quality-round-1`.

## Static inventory classification

| Inventory | Locations | Classification | Reason |
|---|---|---|---|
| Console output | `scripts/validate-source-library.ts:14,21,23,27`; `scripts/validate-content.ts:21,25` | Safe | Command-line validators deliberately report success and actionable failures to stdout/stderr. |
| Render error logging | `src/components/common/ErrorBoundary.tsx:19` | Safe | The error boundary records an unexpected render failure before showing its recovery UI; no user data is logged. |
| TODO/FIXME/HACK/XXX, `@ts-ignore`, `eslint-disable`, `as unknown as` | `src`, `scripts`, `tests`, `.github` | No defect observed | The first required static scan returned no such match. Test casts use direct platform types rather than the audited `as unknown as` pattern. |
| Pages storage bootstrap | `src/main.tsx:7-10`; `src/app/pagesFallback.ts:24-29`; `public/404.html:18-23` | Defect — CL-001 | Storage access can throw before routing or application render, and the 404 fallback then never redirects. |
| Document title and root access | `src/main.tsx:13`; `src/hooks/useDocumentTitle.ts:6-13` | Safe | The fixed HTML shell supplies `#root`; title/description DOM updates are scoped to route metadata. |
| Reduced-motion media query | `src/hooks/useReducedMotion.ts:7-26` | Safe | The listener is removed with the same callback; behavior has focused tests. |
| Graph responsive media query | `src/components/graph/ScientistGraph.tsx:23-61` | Safe | The listener is removed on unmount and mutation testing confirmed the cleanup/complete-list boundary. |
| Header DOM and keyboard listeners | `src/components/layout/Header.tsx:28-63` | Safe | Both media-query and `keydown` listeners are removed; body overflow is restored from the previous value. |
| Observer/frame animation code | `src/components/motion/CountUp.tsx:21-73`; `Reveal.tsx:21-37`; `TimelineLine.tsx:16-32` | Safe | Observers disconnect; CountUp cancels a pending frame; reduced-motion and missing-observer paths resolve to final visible content. Mutation 5 proved the frame cleanup assertion is effective. |
| Archive dialog DOM boundary | `src/components/archive/ArchiveViewer.tsx:26-70` | Safe | Native modal open/cancel/close and focus restoration are explicitly handled and covered by unit/E2E tests. |
| Test DOM/global usage | `*.test.ts(x)` matches from static scan | Test-only | `window`, `document`, observer, frame, dialog and location probes are fixtures/assertions and do not ship. |
| Skip link | `src/components/layout/SkipLink.tsx:5` | Safe | Same-document `#main-content` target exists in `App`. |
| External media anchor | `src/pages/Media.tsx:44`; `src/pages/mediaAction.ts:6-17`; `src/content/media-url.ts:1-12` | Safe | Only validated HTTPS URLs produce an action; the anchor uses `_blank` with `noreferrer noopener`. Mutation 2 was rejected by both validation and UI tests. |
| Gallery/Spirit URL state | `src/pages/Gallery.tsx:17-43`; `src/pages/Spirit.tsx:11-26` | Safe | Values are allow-listed from content, encoded by `URLSearchParams`, and user changes push history. Mutation 4 proved Back restoration is protected. |
| Test-only navigation/dialog calls | `Gallery.test.tsx:16`; `ArchiveViewer.test.tsx:55-99` | Test-only | These calls provide the history control and native-dialog fixture used by focused tests. |
| Open Graph asset | `index.html:18` | Safe | `%BASE_URL%og-cover.svg` is rewritten by Vite for root and repository deployments. |
| Production `/images/` references | `src/content/{activities,archives,media,scientists,sources}.ts` | Safe with known missing assets | Rendered paths flow through `ResilientImage` and `withBasePath`; `sources.ts` paths are registry metadata. The 12 absent files and honest fallbacks are already inventoried in `baseline.md`. |
| Header logo | `src/components/layout/Header.tsx:71` | Safe | The root-relative logo is passed through `withBasePath`. Mutation 1 proved repository-prefix regression coverage. |
| Asset strings in tests | `src/**/*.test.ts(x)` matches from the fourth scan | Test-only | These are fixtures and expected-path assertions, not runtime references. |

Static commands:

```powershell
rg -n "TODO|FIXME|HACK|XXX|console\.(log|warn|error)|@ts-ignore|eslint-disable|as unknown as" src scripts tests .github
rg -n "window\.|document\.|localStorage|sessionStorage|requestAnimationFrame|IntersectionObserver|addEventListener" src
rg -n "href=|target=|rel=|navigate\(|setSearchParams|showModal|close\(" src
rg -n "/images/|/logo|og-cover" src index.html public
```

## Module and dependency boundaries

| Boundary | Result | Evidence |
|---|---|---|
| Export consumers | No orphan production module observed | Router consumes every page and `App`; pages consume layout/common/scientist/graph/motion components; scripts/pages/tests consume every content export and helper. `rg -n '^export ...' src scripts` was cross-checked against the import inventory. |
| Stylesheet entry points | No orphan stylesheet observed | `App.tsx` imports base/components/utilities; `base.css:1` imports tokens. |
| Duplicate normalization | No defect observed | Asset base normalization, Pages route restoration, metadata pathname normalization, and media URL validation have different inputs and security contracts; merging them would conflate responsibilities. |
| Modeled status branches | No defect observed | `completed` activity and `published` media are absent from current content but are valid schema states; validators and focused tests exercise them, so they are not dead branches. |
| Component responsibility | No defect observed | `Home`, `ScientistDetail`, and `ScientistGraph` are large but each remains the composition boundary for one page/visualization; no unrelated reusable domain logic was found inside them. |
| Unsafe HTML/execution | No production usage observed | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, dynamic `Function`, `window.open`, or `postMessage` occurs in production. The sole `Function` match is a build-test harness for `404.html`. |
| Storage | One defect | No local storage is used. Session storage access lacks an exception boundary; see CL-001. |
| Runtime dependency `motion` | Redundant — CL-002 | It is declared as a production dependency but has no import; animation uses React, CSS, observers and animation frames. |
| Direct dev dependency `playwright` | Redundant — CL-003 | All project imports target `@playwright/test`; that package itself declares the `playwright` dependency and CLI binary. |
| `prettier` dev tool | Safe | It is a developer-only formatter and does not enter the production graph; absence from a required script is not sufficient evidence for removal. |
| Homepage graph-preview test | Defective regression boundary — CL-004 | The test compares raw SVG attributes only and remains green despite the user-supplied browser evidence of detached lines. |

## Mutation evidence

Each mutation was the sole production diff at the time it ran. After every RED run the inverse patch was applied, `git diff --name-only` returned no path, and the same focused command passed. No mutation patch remains.

| Mutation | Focused command | Expected RED | Observed RED | Post-restore GREEN |
|---|---|---|---|---|
| Return `/images/` unchanged from `withBasePath` | `vitest run src/app/publicAsset.test.ts src/components/common/ResilientImage.test.tsx` | Repository-deployment image path lacks `/shu-scientist-museum/`. | 1/4 failed at `publicAsset.test.ts:5`; expected prefixed path, received root path. | 4/4 passed. |
| Accept `javascript:` in `isValidPublishedMediaUrl` | `vitest run src/content/content.test.ts src/pages/Media.test.tsx` | Validator and UI action reject the unsafe scheme. | 2/17 failed: `PUBLISHED_MEDIA_INVALID_URL` disappeared and `mediaAction` returned a clickable JavaScript URL. | 17/17 passed. |
| Drop the first scientist from the complete graph list | `vitest run src/components/graph/ScientistGraph.test.tsx` | Mobile fallback is no longer complete. | 1/6 failed at the complete-list assertion because 主题甲/人物甲 was absent. | 6/6 passed. |
| Use `{ replace: true }` for Gallery filter changes | `vitest run src/pages/Gallery.test.tsx` | Back cannot restore the prior filter group. | 1/5 failed; after Back, `spirit-truth-seeking` remained selected instead of clearing. | 5/5 passed. |
| Skip `cancelAnimationFrame` during CountUp cleanup | `vitest run src/components/motion/CountUp.test.tsx` | Unmount does not cancel frame 27. | 1/5 failed because `cancelFrame(27)` had zero calls. | 5/5 passed. |

The combined post-restore run passed 7 files / 37 tests.

## CL-001 — Storage denial can strand Pages deep links and abort startup
- Severity: Important
- Location: `public/404.html:18`; `src/main.tsx:7`; `src/app/pagesFallback.ts:24`
- Reproduction: Execute the fallback script with `sessionStorage.setItem` throwing `DOMException('Access denied', 'SecurityError')`, then call `restorePagesRoute` with `storage.getItem` throwing the same exception.
- Expected: A denied storage API must not prevent navigation to the application shell or prevent React from rendering. If the deep route cannot be preserved, the fallback should still load the site root.
- Actual: The 404 script throws before `window.location.replace(basePath)`, leaving the visitor on the fallback page. The restore function throws before application render; the inline reproduction printed `FALLBACK_REPLACE=not-called` and `MAIN_REPLACE=not-called`.
- Evidence: Node 24 read-only reproductions returned `FALLBACK_THROW=SecurityError:Access denied` and `MAIN_THROW=SecurityError:Access denied`. Existing tests cover malformed stored JSON and safe routes but not storage methods throwing.
- Regression test boundary: Add a build fallback case whose `setItem` throws and still expects `location.replace(basePath)`; add `pagesFallback.test.ts` cases for throwing `getItem`/`removeItem` and a bootstrap-safe no-storage path.
- Recommended smallest fix: Wrap the 404 storage write in `try/finally` so base navigation always runs. Make main/restore storage access exception-safe and treat denied storage as “no saved route.”

## CL-002 — Unused `motion` package remains a production dependency
- Severity: Minor
- Location: `package.json:22`
- Reproduction: Run `rg -n -F "from 'motion'" src scripts tests` and `npm ls --depth=0`.
- Expected: A direct production dependency has a runtime importer or an explicitly documented runtime integration.
- Actual: The import search returns no match. All motion behavior is implemented with React state/effects, CSS, `IntersectionObserver`, and `requestAnimationFrame`, while `motion@12.43.0` is still installed directly.
- Evidence: `rg -n '\bmotion\b' src scripts tests` only found local component paths, reduced-motion strings, and tests; it found no package import.
- Regression test boundary: Remove the package and lockfile root declaration, run `npm ci`, `npm run check`, and all Playwright tests, then compare the production build.
- Recommended smallest fix: Remove `motion` from `dependencies` and refresh `package-lock.json`; do not refactor the working native animation components.

## CL-003 — `playwright` is declared directly in addition to `@playwright/test`
- Severity: Minor
- Location: `package.json:29`; `package.json:40`
- Reproduction: Run `rg -n "@playwright/test" src scripts tests playwright.config.ts`, `rg -n -F "from 'playwright'" src scripts tests`, and inspect `node_modules/@playwright/test/package.json`.
- Expected: E2E tooling has one intentional direct package boundary.
- Actual: Project code imports only `@playwright/test`. That package already depends on the exact `playwright` version and declares the `playwright` CLI, so the additional root declaration duplicates ownership without a direct consumer.
- Evidence: Three imports target `@playwright/test`; direct `playwright` import search returns no match; installed `@playwright/test` declares both `dependencies.playwright` and `bin.playwright`.
- Regression test boundary: Remove only the root `playwright` declaration, regenerate the lockfile, then run `npm ci` and `npx playwright test` to prove CLI/browser behavior remains intact.
- Recommended smallest fix: Remove the direct `playwright` dev dependency and retain `@playwright/test`.

## CL-004 — Homepage graph-preview test cannot detect rendered line detachment
- Severity: Important
- Location: `src/pages/Home.test.tsx:159`; `src/pages/Home.tsx:216`
- Reproduction: Compare the user-supplied desktop screenshot, where preview lines visibly terminate away from their nodes and extend outside the intended connection, with the passing test `connects every graph preview edge to the declared node centers`.
- Expected: The regression boundary fails when a line is visually detached from its declared node after SVG sizing, CSS and browser transforms are applied.
- Actual: The unit test only compares string values of `x1/y1/x2/y2` with `cx/cy`. It does not render layout or project SVG coordinates into viewport coordinates, so it passes while the browser presentation is visibly broken.
- Evidence: `Home.test.tsx:169-184` uses only `getAttribute`; the current screenshot provides browser-level counter-evidence. The Task 1 full suite and this task's focused suite remain green.
- Regression test boundary: Add a Playwright assertion at the affected desktop viewport that converts line endpoints and node centers through `getScreenCTM()` (with a small pixel tolerance), plus stable screenshot evidence in the ignored audit workspace.
- Recommended smallest fix: Treat the visual root cause and production correction as Task 4/remediation work; replace or supplement the raw-attribute unit test with the browser-level geometry assertion.

## No defect observed — URL, navigation, dialog, and cleanup logic
- Commands/files checked: The four static inventories; `src/app/publicAsset.ts`; `src/content/media-url.ts`; `src/pages/mediaAction.ts`; `Gallery.tsx`; `Spirit.tsx`; `Header.tsx`; `ArchiveViewer.tsx`; `ScientistGraph.tsx`; `CountUp.tsx`; `Reveal.tsx`; `TimelineLine.tsx`; related unit and E2E tests.
- Result: Other than CL-001, URL schemes, Pages image prefixing, history push semantics, graph fallback completeness, focus restoration, listener/observer/frame cleanup, and reduced-motion final states have effective test boundaries. All five required mutations failed for their intended reasons and returned green after restoration.

## No defect observed — dead modules, duplicated code, and unsafe execution
- Commands/files checked: Export/import inventories across `src`, `scripts`, and `tests`; package inventory; searches for unsafe HTML/execution and browser storage APIs; all production modules and workflows.
- Result: No orphan production module, accidental unreachable route/status branch, unsafe HTML injection, dynamic production execution, or duplicated normalization suitable for deletion was observed. The only confirmed redundancies are the two dependency declarations in CL-002 and CL-003.
