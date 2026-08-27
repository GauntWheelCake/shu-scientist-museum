# V1 Visual and Page Quality Audit

Audit revision: `c8d71a5294d8d34621d2901e298fafc375f51cbb` on `audit/v1-quality-round-1`.

## Audit method and coverage

- Built the production bundle once and served `dist` at `http://127.0.0.1:43179`.
- Inspected all 18 baseline routes at widths 360, 390, 768, 1024, and 1440 pixels: 90/90 local route/viewport cells. Heights were 844px at 360/390 and 900px at all other widths.
- Every cell recorded the document title, H1, body/root overflow delta, visible viewport escape, clipped controls, first keyboard focus style, image metadata/fallbacks, `console.error`, `pageerror`, failed same-origin requests, and same-origin responses with status 400 or higher.
- Exercised the required dynamic states separately and compared the deployed homepage, three core profiles, graph, media, and an unknown route against the local production build.
- Browser evidence is stored locally under `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/` and remains ignored. No screenshot or local path is committed.

## Finding summary

| Severity | Count | IDs |
|---|---:|---|
| Critical | 0 | None observed |
| Important | 2 | VP-001, VP-002 |
| Minor | 1 | VP-003 |

## VP-001 — Deployed direct deep links retain the address but render the homepage
- Severity: Important
- Routes: deployed `/scientists/qian-weichang`, `/scientists/li-sanli`, `/scientists/huang-hongjia`, `/graph`, `/media`, and an unknown route
- Viewports: 390 and 1440 reproduced; the deployed comparison matrix used 1440 for every listed route
- Reproduction: Open a fresh browser context directly at `https://gauntwheelcake.github.io/shu-scientist-museum/scientists/qian-weichang`; wait for the Pages fallback and application bootstrap to finish. Repeat for the other listed routes without first navigating through the homepage.
- Expected: The URL and rendered route agree: the three profiles expose their respective H1, `/graph` exposes `科学家图谱`, `/media` exposes `影音档案`, and an unknown route exposes `页面未找到`.
- Actual: The final URL correctly returns to the requested repository-prefixed path, but the rendered H1 remains the homepage H1 `追寻前辈榜样，筑梦科技自立自强`. The unknown route also renders the homepage instead of the application 404. Client-side navigation from an already loaded homepage works; the defect is limited to fresh deployed deep-link entry.
- Screenshot evidence: `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/vp-001-deployed-deep-link-home-390.png`; `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/vp-001-deployed-deep-link-home-1440.png`
- DOM/network/console evidence: The initial deep-link document returns HTTP 404 as expected for the GitHub Pages fallback and logs that 404. After fallback processing, Playwright observes the requested final URL but the homepage title/H1/body. `sessionStorage` has already been consumed. The local production preview returns HTTP 200 and the correct H1 before and after refresh, so this is deployment-only. This is distinct from CL-001: CL-001 covers storage APIs throwing, while VP-001 reproduces with normal storage access.
- Recommended smallest fix: Restore the saved Pages route before constructing the browser router, or expose a router factory that is called only after restoration. Add a Pages-fallback integration test that starts from the generated 404 document, then asserts the final URL and H1 for a profile and an unknown route.

## VP-002 — Small bronze index text does not meet normal-text contrast
- Severity: Important
- Routes: `/` (six guide indices), the three core scientist profiles (research chapter indices), `/footprints` (location indices), and `/about` (practice-chain indices)
- Viewports: 360, 390, 768, 1024, and 1440
- Reproduction: Inspect the computed foreground of a guide index such as `.guide-card__index` against the paper surface. The same token pairing is used by the other listed index elements.
- Expected: Normal-size text meets WCAG AA contrast of at least 4.5:1 against its surface while the bronze decorative language remains recognizable.
- Actual: The foreground is `rgb(166, 132, 82)` (`#a68452`) and the paper background is `rgb(243, 239, 231)` (`#f3efe7`), producing approximately 3.03:1. Font sizes are 14–16px, so the 3:1 large-text exception does not apply. The values and visibility are invariant across the five widths.
- Screenshot evidence: `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/vp-002-bronze-index-contrast-1440.png`
- DOM/network/console evidence: Computed-style sampling found the same failing pair on all six homepage guide indices, the core-profile `research-chapters__number` elements, four footprint indices, and four about-page chain indices. The route matrix found no clipping or overflow around these elements; contrast is the isolated defect.
- Recommended smallest fix: Keep `--color-bronze` for borders, lines, and large decoration, introduce a darker bronze text token that reaches 4.5:1 on both paper surfaces, and apply it only to the affected small index selectors. Add a computed-color contrast assertion for the shared text token.

## VP-003 — “项目定位” label is red on black at 2.02:1
- Severity: Minor
- Routes: `/about`
- Viewports: 360, 390, 768, 1024, and 1440
- Reproduction: Open `/about` and inspect the first paragraph inside `.about-page__positioning`.
- Expected: The 12px section label uses the intended light archive color on the dark positioning panel and meets 4.5:1.
- Actual: The label computes to `rgb(143, 29, 34)` on `rgb(23, 23, 23)`, approximately 2.02:1. The more specific earlier selector `.about-page > article > p:first-child` wins over the later intended `.about-page__positioning > p:first-child` rule.
- Screenshot evidence: `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/vp-003-about-label-contrast-1440.png`
- DOM/network/console evidence: The label is visible and unclipped at every required width, but computed foreground/background colors remain the failing pair. No console or network error accompanies the defect.
- Recommended smallest fix: Give the positioning label a dedicated class or an equally specific rule and set it to the existing archive/light token; add a focused CSS computed-style test so selector order cannot restore the red-on-black pair.

## Route-by-viewport matrix — local production preview

`Pass` means HTTP 200, exactly one expected H1, zero body/root horizontal overflow, no visible element outside the viewport, no clipped interactive control, a visible 3px solid first-tab focus outline, and no console/page/same-origin resource failure in that cell. Contrast findings are listed separately because they are cross-cutting token/selector defects rather than layout-cell failures.

| Route | 360 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| `/` | VP-002 | VP-002 | VP-002 | VP-002 | VP-002 |
| `/scientists` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/qian-weichang` | VP-002 | VP-002 | VP-002 | VP-002 | VP-002 |
| `/scientists/li-sanli` | VP-002 | VP-002 | VP-002 | VP-002 | VP-002 |
| `/scientists/huang-hongjia` | VP-002 | VP-002 | VP-002 | VP-002 | VP-002 |
| `/scientists/sun-jinliang` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/zhou-bangxin` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/yang-xiongli` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/xie-shaorong` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/yue-xiaodong` | Pass | Pass | Pass | Pass | Pass |
| `/scientists/not-a-scientist` | Pass | Pass | Pass | Pass | Pass |
| `/timeline` | Pass | Pass | Pass | Pass | Pass |
| `/spirit` | Pass | Pass | Pass | Pass | Pass |
| `/graph` | Pass | Pass | Pass | Pass | Pass |
| `/footprints` | VP-002 | VP-002 | VP-002 | VP-002 | VP-002 |
| `/media` | Pass | Pass | Pass | Pass | Pass |
| `/about` | VP-002, VP-003 | VP-002, VP-003 | VP-002, VP-003 | VP-002, VP-003 | VP-002, VP-003 |
| `/not-a-real-museum-route` | Pass | Pass | Pass | Pass | Pass |

## Dynamic-state evidence

| State | Result | Evidence |
|---|---|---|
| Mobile menu | Pass | At 390px the menu is absent when closed, opens by keyboard with `aria-expanded=true`, sets body overflow to `hidden`, closes with Escape, and restores focus to the trigger. |
| Gallery filters and history | Pass | Field plus spirit produces the expected empty result; reset restores eight cards; browser Back restores the prior field-only URL and control values. |
| Timeline | Pass | The page is a static chronological sequence rather than a selectable control. All six events and their related-person links remain visible; reduced-motion progress reaches the final transform. |
| Spirit themes | Pass | All six controls update the query parameter, pressed state, profile title, related people, and story/collecting state. |
| Graph visual/list modes | Pass | Desktop graph contains eight person nodes, six theme nodes, and the complete eight-entry text list. Each person focus activates exactly its modeled edges (3, 4, 3, 3, 3, 3, 3, 3); each theme keyboard selection activates 6, 5, 5, 2, 3, and 4 edges respectively. |
| Graph mobile override | Pass | At 390px the complete eight-person list is the default; explicit graph mode exposes all eight person and six theme nodes; switching back removes the SVG and keeps the list. |
| Archive dialog | Pass | Native Escape/cancel and close button both remove the dialog and restore focus to `查看档案`; initial focus is on `关闭档案查看器`. |
| Planned activities | Pass | Four cards remain `计划中`, participant result remains zero, each of the four route filters yields one card, and four absent images render honest fallbacks. |
| Collecting media | Pass | Three items remain `资料整理中`, have three honest cover fallbacks, and expose zero public media links. This agrees with CF-049 rather than duplicating it. |
| Image failure | Pass | Forced failure of a normally present 钱伟长 portrait replaces the broken image with the named `钱伟长肖像暂缺` fallback. All real image elements inspected have non-empty alt text; the three present portraits render with `object-fit: cover`. |
| Local deep-link refresh and 404 | Pass | `/scientists/li-sanli` returns HTTP 200 and retains H1 `李三立` after refresh; both unknown scientist and global unknown routes render `页面未找到`. |
| Reduced motion | Pass | Home reveal content computes to `opacity: 1; transform: none`; timeline progress computes to the final `matrix(1, 0, 0, 1, 0, 0)`. |

## Homepage graph screenshot review

The detached-line screenshot supplied by the user predates deployed SHA `9da9b58786d74f454ce7a8a20ee9631a7d379e5d`. It does not reproduce in the current local production build or current deployed homepage:

- the SVG viewBox is `0 0 640 384`;
- the three lines end at the centers of the intended nodes: person `(120,104)`, event `(520,168)`, and spirit `(408,296)`;
- local and deployed DOM bounding boxes place every line inside the graph preview (`outsideLines=0`);
- the current local and deployed screenshots show all three edges connected to the three circles.

Representative pass evidence: `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/pass-local-home-graph-1440.png` and `.superpowers/sdd/2026-08-27-v1-quality-audit/visual-evidence/pass-deployed-home-graph-1440-waited.png`.

This screenshot is therefore classified as stale/cache-related evidence, not a current VP defect. If it appears again after the next deployment, capture the page URL, hard-refresh result, loaded JavaScript/CSS asset hashes, and browser zoom before reopening the finding.

## Local/deployed comparison

| Target | Local production preview | Current deployed behavior | Classification |
|---|---|---|---|
| Homepage | Correct H1, zero overflow/errors, connected graph preview | HTTP 200, repository-prefixed script/style assets, zero overflow/errors, connected graph preview | Pass; old graph screenshot not reproduced |
| 钱伟长 profile | Direct and refreshed H1 `钱伟长` | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |
| 李三立 profile | Direct and refreshed H1 `李三立` | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |
| 黄宏嘉 profile | Direct and refreshed H1 `黄宏嘉` | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |
| Graph | Direct H1 `科学家图谱`; 8 people/6 themes | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |
| Media | Direct H1 `影音档案`; collecting state correct | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |
| Unknown route | Application H1 `页面未找到` | Fresh direct URL renders homepage H1 | Deployment-only VP-001 |

The deployed homepage loads its JavaScript and stylesheet from `/shu-scientist-museum/assets/`; no missing base-prefixed resource was observed on the homepage. Content-source corrections and unsupported claims remain exclusively under CF IDs in `content-findings.md`; they are not duplicated here as visual defects.

## No other defect observed

- No local route/viewport cell has horizontal overflow, visible off-canvas content, clipped controls, a missing H1, or a missing first-tab focus outline.
- No local matrix cell emitted `console.error`, `pageerror`, failed same-origin requests, or same-origin 4xx/5xx responses.
- Header/nav, cards, profile sections, timeline, graph, activity/media fallbacks, about panels, and both 404 layouts preserve the established visual direction at all five widths.
- Present portraits have natural dimensions 钱伟长 330×306, 李三立 291×349, 黄宏嘉 369×282; their responsive crops use `object-fit: cover` and remain unclipped. Known absent portraits/activity/media covers render the intentional fallback already inventoried in `baseline.md`.
