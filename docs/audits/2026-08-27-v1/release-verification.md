# V1 Audit Remediation Release Verification

Verified on 2026-08-27.

## Revisions

- Audit and remediation base: `9da9b58786d74f454ce7a8a20ee9631a7d379e5d`.
- Reviewed remediation head: `2d0ad12116e30cf85af993c0cdf959d45d780447`.
- Pull request: [#4 — fix: complete V1 quality remediation](https://github.com/GauntWheelCake/shu-scientist-museum/pull/4).
- Merged `main` revision: `b0d689c2e770812d0229e9c89037c55b910043cf`.

## Local gates

| Gate | Observed result |
|---|---|
| `npm ci` with Node 24 | Exit 0; 272 packages installed, 273 audited, 0 vulnerabilities. |
| `npm run check` | Exit 0; content validation, ESLint and TypeScript passed; Vitest 26/26 files and 129/129 tests passed; production build completed with 85 modules. |
| `npx playwright test` | Exit 0; 16/16 tests passed with the default eight workers in 33.1 seconds. |
| Root and repository-base builds | Exit 0 for `/` and `/shu-scientist-museum/`; asset, Open Graph and generated 404 base assertions passed. |
| Production preview matrix | Two stable 90/90 runs covering 18 routes at 360, 390, 768, 1024 and 1440 pixels; no overflow, clipped controls or runtime failures. |
| Dynamic acceptance | Deep links, navigation, filter history, six spirit themes, graph list/graphic modes, archive dialog focus and closure, four activity fallbacks, collecting media and reduced motion passed. |

## Finding closure

| Task | Closed findings | Independent review |
|---|---|---|
| 1 | CL-001, VP-001 | APPROVE |
| 2 | CL-002, CL-003 | APPROVE |
| 3 | CF-005, CF-007 | APPROVE |
| 4 | CF-010, CF-012, CF-013, CF-016, CF-050 | APPROVE |
| 5 | CF-018, CF-020, CF-022, CF-023 | APPROVE |
| 6 | CF-026, CF-028, CF-029, CF-032, CF-034, CF-036, CF-039, CF-040 | APPROVE |
| 7 | CF-041 | APPROVE, including the two-line graph-label fix |
| 8 | CF-043, CF-044, CF-045, CF-046, CF-048 | APPROVE |
| 9 | VP-002, VP-003 | APPROVE |

All 31 accepted finding IDs are closed exactly once. CF-002 and the 25 Verified audit rows were not changed. The final branch review reported zero open Critical or Important issues.

## GitHub and Pages

- Pull-request quality job: [successful](https://github.com/GauntWheelCake/shu-scientist-museum/actions/runs/33087032806/job/98569370097).
- Post-merge CI run: [successful](https://github.com/GauntWheelCake/shu-scientist-museum/actions/runs/33087736406).
- GitHub Pages deployment: [successful](https://github.com/GauntWheelCake/shu-scientist-museum/actions/runs/33087736421).
- Published site: [上海大学科学家精神数字展馆](https://gauntwheelcake.github.io/shu-scientist-museum/).

## Live acceptance

Fresh cache-disabled contexts at 390 and 1440 pixels produced the following final URL/H1 pairs after the expected GitHub Pages deep-document `404 → 200` recovery:

| URL | Expected and observed H1 |
|---|---|
| `https://gauntwheelcake.github.io/shu-scientist-museum/` | `追寻前辈榜样，筑梦科技自立自强` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/scientists/qian-weichang` | `钱伟长` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/scientists/li-sanli` | `李三立` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/scientists/huang-hongjia` | `黄宏嘉` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/graph` | `科学家图谱` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/media` | `影音档案` |
| `https://gauntwheelcake.github.io/shu-scientist-museum/not-a-real-museum-route` | `页面未找到` |

- Core route/width cells: 14/14 passed; supplemental Footprints/About cells: 4/4 passed.
- After the final URL and H1 settled, all 18 cells had zero new console errors, page errors and required repository-asset failures during the observation window.
- The lowest audited small-text contrast was 5.425:1.
- The homepage graph had three in-bounds edges connected to their intended node centers at both widths.
- All six official spirit titles remained inside their graph diamonds at both widths.
- Footprints rendered four planned-activity cards, four honest fallbacks and zero activity images.
- With session storage denied, a fresh profile deep request reached the site homepage instead of remaining stranded on the generated 404 document.
