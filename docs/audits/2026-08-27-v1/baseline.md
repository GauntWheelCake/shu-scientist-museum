# V1 Quality Audit Baseline

## Revisions
- Local main SHA: `9da9b58786d74f454ce7a8a20ee9631a7d379e5d` (audit branch starting revision)
- Remote main SHA: `9da9b58786d74f454ce7a8a20ee9631a7d379e5d`
- Pages workflow URL: https://github.com/GauntWheelCake/shu-scientist-museum/actions/workflows/deploy-pages.yml
- Site URL: https://gauntwheelcake.github.io/shu-scientist-museum/

## Runtime
- Node: `v24.19.0` (bundled Codex runtime; satisfies `>=22.12 <25`)
- npm: `10.5.2`
- Browser: Chromium `151.0.7922.34` (Playwright-managed browser, read from `browser.version()`)

## Quality Gates
| Gate | Command | Exit | Evidence |
|---|---|---:|---|
| Clean dependency install | `npm ci` | 0 | Node 24 directly launched the npm CLI; 277 packages installed, 278 audited, 0 vulnerabilities. The first sandboxed attempt exited non-zero because the sandbox could not read `AppData/Local/npm-cache`; the unchanged command was rerun with normal file permissions. |
| Full project check | `npm run check` | 0 | Content validation passed; ESLint passed with zero warnings; TypeScript passed; Vitest passed 25 files / 115 tests; Vite production build passed with 84 modules transformed. A prior sandboxed run reached Vitest and then failed to read `vite.config.ts`; the unchanged gate passed with normal file permissions. |
| End-to-end suite | `npx playwright test` | 0 | 16/16 tests passed across `desktop-chrome` and `iphone-13`, using the default 8 workers, in 1.3 minutes. The known local resource timeout did not reproduce, so no low-concurrency rerun was required. |

## Route Inventory
| Route | Page | Deep-link required | Dynamic states |
|---|---|---|---|
| `/` | 首页 | Yes | Content counts and planned/collecting summaries; graph-entry preview; missing-image fallbacks; normal and reduced-motion final states. |
| `/scientists` | 前辈群像 | Yes | `field` and `spirit` query filters, combined filters, invalid-query normalization, zero-result state, reset, and browser Back restoration. |
| `/scientists/qian-weichang` | 钱伟长人物专题 | Yes | Six-part profile, archive dialog open/native cancel/close/focus return, image failure fallback, and next-core-person link. |
| `/scientists/li-sanli` | 李三立人物专题 | Yes | Six-part profile, archive dialog open/native cancel/close/focus return, image failure fallback, and next-core-person link. |
| `/scientists/huang-hongjia` | 黄宏嘉人物专题 | Yes | Six-part profile, archive dialog open/native cancel/close/focus return, image failure fallback, and next-core-person link. |
| `/scientists/sun-jinliang` | 孙晋良人物专题 | Yes | Missing portrait fallback; research, archive, story, and legacy collecting states; next-core-person link. |
| `/scientists/zhou-bangxin` | 周邦新人物专题 | Yes | Missing portrait fallback; research, archive, story, and legacy collecting states; next-core-person link. |
| `/scientists/yang-xiongli` | 杨雄里人物专题 | Yes | Missing portrait fallback; research, archive, story, and legacy collecting states; next-core-person link. |
| `/scientists/xie-shaorong` | 谢少荣人物专题 | Yes | Missing portrait fallback; research, archive, story, and legacy collecting states; next-core-person link. |
| `/scientists/yue-xiaodong` | 岳晓冬人物专题 | Yes | Missing portrait fallback; research, archive, story, and legacy collecting states; next-core-person link. |
| `/scientists/:unknown-slug` | 人物专题内 404 | Yes | Unknown scientist recovery links to the gallery and homepage. |
| `/timeline` | 岁月长河 | Yes | Six dated events sorted by first stated year; related-person links; normal and reduced-motion timeline states. |
| `/spirit` | 精神谱系 | Yes | Six `theme` query selections, invalid-query fallback to the first theme, browser history, related people/stories, and no-story collecting state. |
| `/graph` | 科学家图谱 | Yes | Graphic/list modes; responsive default mode; explicit mode override; eight person-node focus states; six theme-node mouse/keyboard states; selected, neighbour, and dimmed relationships. |
| `/footprints` | 精神足迹 | Yes | All/branch/school/community/military filters; four planned activity states; zero verified participant count; missing-image fallbacks. |
| `/media` | 影音档案 | Yes | Three collecting records with no public action and missing-image fallbacks; the validated published HTTPS action branch is present but not used by current content. |
| `/about` | 关于项目 | Yes | Static confirmed project positioning, practice chain, and team facts; normal and reduced-motion reveal states. |
| `/*` | 全局 404 | Yes | Unknown-route recovery links to homepage and the scientist gallery. |

The route inventory is reproducible from `src/app/router.tsx` plus `rg -n "slug:" src/content/scientists.ts`. The eight dynamic scientist slugs above are all current values in `scientists`; story slugs are content identifiers and do not have public routes.

## Asset Inventory
| Group | Referenced | Present | Missing | Notes |
|---|---:|---:|---:|---|
| Scientist portraits | 8 | 3 | 5 | Present: 钱伟长、李三立、黄宏嘉. The remaining five references intentionally exercise the current resilient-image collecting fallback. |
| Archive images | 3 | 3 | 0 | All three referenced courseware archive WebP files are tracked under `public/images/archives/`. |
| Activity images | 4 | 0 | 4 | All four planned-activity image references are absent and render through the honest fallback state. |
| Media covers | 3 | 0 | 3 | All three collecting-media cover references are absent and render through the honest fallback state. |
| Shell/share assets | 2 | 2 | 0 | `public/logo.svg` and `public/og-cover.svg` are tracked and present. |
| Total public asset references | 20 | 8 | 12 | There are 18 unique `/images/` references in production content plus two shell/share references. `public/` contains exactly eight tracked image/SVG assets; `public/404.html` is not counted as an image asset. |

Reproduction commands:

```powershell
git ls-files public
rg -o --no-filename -g '*.ts' -g '!*.test.ts' '/images/[A-Za-z0-9._/-]+' src/content | Sort-Object -Unique
# For each unique reference: Test-Path ('public' + ($reference -replace '/', '\'))
```

## Repository Hygiene
| Check | Result | Evidence |
|---|---|---|
| Branch and revision | Clean audit branch at deployed revision | `git status --short --branch` reported `audit/v1-quality-round-1...origin/main`; local HEAD and `origin/main` both resolved to `9da9b58786d74f454ce7a8a20ee9631a7d379e5d`. |
| Tracked file count | 113 | `git ls-files \| Measure-Object` returned 113. |
| TODO/FIXME/HACK/XXX markers | None observed in production or tests | The required `git grep -n -E 'TODO|FIXME|HACK|XXX' -- src tests docs` returned only three self-referential command examples in `docs/superpowers/plans/2026-08-27-v1-quality-audit.md`; no marker occurred in `src` or `tests`. |
| Tracked caches/build/test output | None observed | `git ls-files` filtered for `node_modules`, `dist`, `coverage`, `playwright-report`, `test-results`, `.superpowers`, and `*.log` returned no matches. Generated gate output remains ignored. |
| Local absolute paths in tracked project files | 1 pre-existing occurrence | `rg -n '[A-Za-z]:\\' src tests docs .github public package.json vite.config.ts playwright.config.ts` identified `docs/superpowers/plans/2026-08-27-v1-hardening-release.md:49`, which names the local worktree. The baseline does not modify this existing document. |
| Public asset/source correspondence | 18 content references checked; 6 present and 12 missing | The asset reproduction commands above enumerate every unique production-content image path and check its corresponding `public` path. Missing references are listed by group in Asset Inventory. |
| Dependency audit | 0 vulnerabilities | Successful `npm ci` audited 278 packages and reported 0 vulnerabilities. |
| Whitespace and tracked diff | None observed before baseline creation | `git diff --check` exited 0 and initial `git status --short` was empty. |
