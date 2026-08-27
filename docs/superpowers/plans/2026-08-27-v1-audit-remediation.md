# V1 Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct every accepted V1 audit finding with the smallest evidence-backed change, preserve the established museum experience, and publish a verified GitHub Pages release.

**Architecture:** Keep the current React content-model architecture and route set. Fix Pages startup by restoring the saved URL before constructing the browser router; express factual corrections in the existing typed content modules; allow an absent planned-activity image as an explicit honest state; and isolate text contrast from decorative bronze through one new token. Each task owns one reviewable root cause or content domain and closes every listed finding exactly once.

**Tech Stack:** React 19, TypeScript 5.9, React Router 7, Vite 7, Vitest 3, Testing Library, Playwright 1.55, CSS custom properties, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-27-v1-quality-audit-design.md`

## Global Constraints

- Preserve the existing “红色文化 × 科技档案 × 现代博物馆” visual direction, information architecture, primary colors, routes, and page set.
- Audit and release widths are exactly 360, 390, 768, 1024, and 1440 pixels.
- Keep every existing scientist, story, event, spirit, activity, media, archive, and source ID stable unless this plan explicitly removes the unsupported `event-li-911-1964` record; do not rename routes or slugs.
- Keep all four activities at `status: 'planned'` and `participantCount: 0`, and all three media items at `status: 'collecting'` without platform, URL, or playback action.
- Do not infer facts, invent activity results, generate historical/archive images, or add a replacement image without a real registered source.
- Direct authoritative URLs and exact replacement wording in this plan are the content contract; search summaries, encyclopedias, and self-media are not implementation evidence.
- Do not modify source-library originals or commit screenshots, browser caches, build output, test output, internal reports, or local absolute paths.
- Every production change starts with the named RED assertion/evidence, reaches the focused GREEN command, passes independent review, and remains inside the files named by its task.

## File and interface map

| File | Responsibility after remediation | Interface change |
|---|---|---|
| `src/app/pagesFallback.ts` | Parse and restore a Pages deep route without allowing storage denial to abort startup. | `getPagesRouteStorage(source): RouteStorage \| undefined`; `restorePagesRoute({ baseUrl, storage?, replace }): void`. |
| `src/app/router.tsx` | Define the unchanged route tree and construct it only after restoration. | Export typed `appRoutes: RouteObject[]` for memory-router tests and `createAppRouter(basename?: string)` for production; remove eager `appRouter`. |
| `src/app/bootstrap.ts` | Own the production startup order so the same callable boundary is exercised by integration tests and `main.tsx`. | Export `bootstrapApp({ source, baseUrl, render }): ReturnType<typeof createAppRouter>`; restore history before router construction. |
| `src/main.tsx` | Invoke the tested startup boundary and render the returned router. | Calls only `bootstrapApp(...)` for Pages restoration/router construction. |
| `public/404.html` | Save a relative deep route when possible and always navigate to the application base without leaking storage errors. | Storage write is inside `try/catch`; base redirect is inside `finally`. |
| `src/content/scientists.ts` | Hold corrected scientist, chapter, story, field, and relationship copy. | Data shape is unchanged. |
| `src/content/events.ts` | Hold the five retained evidence-backed timeline records. | Remove only `event-li-911-1964`; other IDs remain unchanged. |
| `src/content/spirit-themes.ts` | Hold the six official full theme titles. | Six stable `spirit-*` IDs and all references remain unchanged. |
| `src/content/types.ts` | Represent an honest planned activity without a fabricated image record. | `Activity.image` changes from `SourcedImage` to `SourcedImage | undefined` via `image?: SourcedImage`. |
| `src/content/activities.ts` | Hold stale-date-safe planned copy and no pseudo image metadata. | All four records omit `image`; status, count, ID, type and relationships remain unchanged. |
| `src/content/validate.ts` | Permit image-free planned activities but continue requiring image metadata for completed activities. | `MISSING_ACTIVITY_IMAGE` applies when `status === 'completed'`; supplied images keep the existing src/alt/source ID checks. |
| `src/components/common/ResilientImage.tsx` | Render the same fallback for a missing source and a load failure. | `src?: string`; missing `src` immediately returns the existing accessible fallback. |
| `src/pages/Footprints.tsx` | Pass optional activity images to `ResilientImage`. | `src={activity.image?.src}`, `alt={activity.image?.alt ?? activity.title}`. |
| `src/pages/Timeline.tsx` | Sort exact “20世纪60年代” wording in chronological position. | `eventYear` recognizes both a four-digit year and `NN世纪NN年代`. |
| `src/pages/Home.tsx` | Label the dynamic event count without claiming all nodes are verified. | Group name becomes `展馆数据`; count label becomes `个时间节点`. |
| `src/pages/About.tsx` | Give the dark-panel label a stable CSS hook. | First positioning paragraph gets `className="about-page__positioning-label"`. |
| `src/styles/tokens.css` | Distinguish small bronze text from decorative bronze. | Add `--color-bronze-text: #765a31` (contrast 5.59:1 on `#f3efe7`). |
| `src/styles/components.css` | Apply the dark token to affected small indices and the archive token to the About label. | Decorative borders/lines continue using `--color-bronze`. |
| `package.json`, `package-lock.json`, `README.md` | Keep only direct dependencies and accurate stack documentation. | Remove `motion` and root `playwright`; retain `@playwright/test`. |
| `docs/content-guide.md` | Document optional images for planned activities and required images for completed activities. | Planned example omits `image`; completion rule still requires verified image provenance. |
| `docs/audits/2026-08-27-v1/release-verification.md` | Record local, CI, deployment, and live acceptance evidence without machine paths. | New release record created only in Task 10. |

---

### Task 1: Make the GitHub Pages bootstrap storage-safe and route-correct

**Finding IDs closed:** CL-001, VP-001

**Files:**
- Modify: `src/app/pagesFallback.ts`
- Modify: `src/app/pagesFallback.test.ts`
- Modify: `src/app/router.tsx`
- Create: `src/app/bootstrap.ts`
- Create: `tests/build/pages-fallback-integration.spec.tsx`
- Modify: `src/main.tsx`
- Modify: `src/pages/Home.test.tsx`
- Modify: `public/404.html`
- Modify: `tests/build/pages-fallback-build.spec.ts`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: storage key `museum:pages-route`, `import.meta.env.BASE_URL`, the current route tree, and `window.history.replaceState`.
- Produces: `getPagesRouteStorage(source): RouteStorage | undefined`, exception-safe `restorePagesRoute`, lazy `createAppRouter(basename?)`, and the single tested `bootstrapApp(...)` startup boundary used by `main.tsx`.
- Test discovery: include `tests/build/**/*.spec.{ts,tsx}` so the production-bootstrap integration test is part of the ordinary Vitest gate.

- [ ] **Step 1: Add RED storage-denial and bootstrap-order tests**

Add these cases to `src/app/pagesFallback.test.ts`:

```ts
it('treats denied session storage as no saved route', () => {
  const deniedWindow = {
    get sessionStorage(): Storage {
      throw new DOMException('Access denied', 'SecurityError');
    },
  };

  expect(getPagesRouteStorage(deniedWindow)).toBeUndefined();
  expect(() =>
    restorePagesRoute({
      baseUrl: '/shu-scientist-museum/',
      storage: undefined,
      replace: () => undefined,
    }),
  ).not.toThrow();
});

it('does not abort when stored-route reads or cleanup are denied', () => {
  expect(() =>
    restorePagesRoute({
      baseUrl: '/shu-scientist-museum/',
      storage: {
        getItem: () => {
          throw new DOMException('Access denied', 'SecurityError');
        },
        removeItem: () => undefined,
      },
      replace: () => undefined,
    }),
  ).not.toThrow();
});
```

Create `tests/build/pages-fallback-integration.spec.tsx`. Build once with `VITE_BASE_PATH=/shu-scientist-museum/`, read the generated `404.html` script, and for each pair below execute that real script against a fake `window` whose storage is a `Map` and whose `location.replace` records the base redirect:

```ts
const cases = [
  ['/scientists/qian-weichang', '钱伟长'],
  ['/not-a-real-museum-route', '页面未找到'],
] as const;
```

After the generated script redirects to `/shu-scientist-museum/`, set jsdom history to that base and call the production `bootstrapApp(...)` boundary with the captured storage adapter and a render callback that mounts `<RouterProvider router={router} />`; assert the expected level-one heading. Also read `src/main.tsx` and assert it imports/calls `bootstrapApp` and does not import/call `createAppRouter` or `restorePagesRoute` directly. Unmount and call `router.dispose()` before the next case. This integration boundary must fail if the generated fallback payload, the restoration-before-construction order, or the actual `main.tsx` startup wiring regresses.

In `tests/build/pages-fallback-build.spec.ts`, execute the generated script a second time with `sessionStorage.setItem` throwing `DOMException('Access denied', 'SecurityError')` and assert `redirectedTo === basePath`.

- [ ] **Step 2: Run the RED tests**

```powershell
npx vitest run src/app/pagesFallback.test.ts tests/build/pages-fallback-build.spec.ts tests/build/pages-fallback-integration.spec.tsx
```

Expected: RED because `getPagesRouteStorage` and `createAppRouter` do not exist, eager router construction captures `/`, storage exceptions escape, and the built fallback does not redirect after `setItem` throws.

- [ ] **Step 3: Implement the smallest safe startup sequence**

In `src/app/pagesFallback.ts`, export the storage boundary and make the option optional:

```ts
type RouteStorage = Pick<Storage, 'getItem' | 'removeItem'>;

export function getPagesRouteStorage(
  source: Pick<Window, 'sessionStorage'>,
): RouteStorage | undefined {
  try {
    return source.sessionStorage;
  } catch {
    return undefined;
  }
}
```

Inside `restorePagesRoute`, return when storage is absent, wrap `getItem` in `try/catch`, and wrap `removeItem` independently so cleanup denial cannot prevent a valid route from being parsed and replaced. Keep `isSafeRoute` and the existing protocol-relative/backslash/query/hash checks unchanged.

In `src/app/router.tsx`, import `RouteObject`, export the unchanged definitions as `appRoutes: RouteObject[]`, and replace the eager export with:

```tsx
export function createAppRouter(basename = import.meta.env.BASE_URL) {
  return createBrowserRouter(appRoutes, { basename });
}
```

In `src/pages/Home.test.tsx`, replace the `appRouter` import with `appRoutes` and pass `appRoutes` directly to `createMemoryRouter`.

Create `src/app/bootstrap.ts` and keep the startup order inside this exported function:

```ts
type BootstrapWindow = Pick<Window, 'sessionStorage' | 'history'>;

export function bootstrapApp({
  source,
  baseUrl,
  render,
}: {
  source: BootstrapWindow;
  baseUrl: string;
  render: (router: ReturnType<typeof createAppRouter>) => void;
}) {
  const storage = getPagesRouteStorage(source);
  restorePagesRoute({
    baseUrl,
    storage,
    replace: (url) => source.history.replaceState(null, '', url),
  });
  const router = createAppRouter(baseUrl);
  render(router);
  return router;
}
```

In `src/main.tsx`, call only `bootstrapApp({ source: window, baseUrl: import.meta.env.BASE_URL, render: (router) => createRoot(...).render(<RouterProvider router={router} />) })`; do not construct or restore the router outside that boundary.

In `public/404.html`, preserve the current payload but guarantee navigation:

```js
try {
  window.sessionStorage.setItem(
    'museum:pages-route',
    JSON.stringify({ pathname: relativePath, search, hash }),
  );
} catch {
  // Storage can be denied; the base navigation must still continue.
} finally {
  window.location.replace(basePath);
}
```

- [ ] **Step 4: Run focused GREEN verification**

```powershell
npx vitest run src/app/pagesFallback.test.ts tests/build/pages-fallback-build.spec.ts tests/build/pages-fallback-integration.spec.tsx
npm run typecheck
```

Expected: all focused tests pass; storage-denied fallback still redirects; the profile and unknown-route H1 match their restored URLs.

- [ ] **Step 5: Commit**

```powershell
git add src/app/pagesFallback.ts src/app/pagesFallback.test.ts src/app/router.tsx src/app/bootstrap.ts src/main.tsx src/pages/Home.test.tsx public/404.html tests/build/pages-fallback-build.spec.ts tests/build/pages-fallback-integration.spec.tsx vite.config.ts
git commit -m "fix: restore Pages routes before router startup"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer inspect the commit for CL-001 and VP-001, explicitly checking storage getter/get/remove exceptions, safe-route rejection, restoration-before-router construction, repository basename, profile H1, and unknown-route H1. Accept only with zero Critical/Important issues; address any issue with the same focused RED/GREEN commands and a separate fix commit.

### Task 2: Remove the two redundant direct dependencies

**Finding IDs closed:** CL-002, CL-003

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: native React/CSS/observer/frame motion implementation and `@playwright/test`'s CLI/transitive `playwright` dependency.
- Produces: one direct E2E ownership boundary (`@playwright/test`) and no unused `motion` runtime package.

- [ ] **Step 1: Record RED dependency evidence**

```powershell
rg -n -F "from 'motion'" src scripts tests
rg -n -F "from 'playwright'" src scripts tests playwright.config.ts
npm ls motion playwright @playwright/test --depth=0
```

Expected: both import searches return no match while `motion` and `playwright` appear as direct root packages; `@playwright/test` remains direct.

- [ ] **Step 2: Remove only the redundant declarations**

```powershell
npm uninstall motion
npm uninstall --save-dev playwright
```

Change the README stack line from `React 19、TypeScript、React Router、Motion` to `React 19、TypeScript、React Router、CSS 动效`, and keep the Playwright tool mention because `@playwright/test` remains.

- [ ] **Step 3: Run focused GREEN dependency verification**

```powershell
npm ci
npm ls motion playwright @playwright/test --depth=0
npx playwright test
```

Expected: `motion` is absent at the root; `playwright` is not a root declaration but is available beneath `@playwright/test`; Playwright remains 16/16.

- [ ] **Step 4: Prove no unrelated package churn**

```powershell
git diff -- package.json package-lock.json README.md
git diff --check
```

Expected: the lockfile removes only the two root ownership entries and packages made unreachable by `motion`; no version upgrade is introduced.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json README.md
git commit -m "chore: remove redundant runtime and e2e dependencies"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer confirm CL-002/CL-003 only: no runtime import was orphaned, `npx playwright test` still resolves through `@playwright/test`, and README no longer claims the removed Motion package. Resolve any issue before continuing.

### Task 3: Correct and narrow the two 钱伟长 claims

**Finding IDs closed:** CF-005, CF-007

**Files:**
- Modify: `src/content/scientists.ts`
- Modify: `src/content/events.ts`
- Modify: `src/content/content.test.ts`

**Interfaces:**
- Consumes: existing IDs `scientist-qian-weichang`, `chapter-qian-circular-plate-perturbation`, and `event-qian-return-1946`.
- Produces: unchanged IDs/relationships with conflict-safe award copy and an evidence-backed return event.

**Authoritative evidence:** [上海大学档案馆](https://dangan.shu.edu.cn/info/1042/20806.htm), [中国科学院](https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml), [清华大学](https://www.tsinghua.edu.cn/info/1182/98259.htm), [清华校友总会](https://www.tsinghua.org.cn/info/1014/9997.htm). Accessed 2026-08-27.

- [ ] **Step 1: Add RED exact-copy assertions**

Add to the existing `museum content` tests:

```ts
const qian = scientists.find(({ id }) => id === 'scientist-qian-weichang')!;
const awardChapter = qian.chapters.find(
  ({ id }) => id === 'chapter-qian-circular-plate-perturbation',
)!;
const returnEvent = events.find(({ id }) => id === 'event-qian-return-1946')!;

expect(awardChapter.significance).toBe(
  '相关工作获中国科学院国家科学奖二等奖。',
);
expect(returnEvent.description).toBe(
  '1946年5月，钱伟长回国，随后任清华大学教授。',
);
expect(JSON.stringify([awardChapter, returnEvent])).not.toMatch(/1955年|洛杉矶|乘船/);
```

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts
```

Expected: the current copy still contains `1955年` and `从洛杉矶乘船`.

- [ ] **Step 3: Apply the exact narrowed wording**

Set `chapter-qian-circular-plate-perturbation.significance` and `event-qian-return-1946.description` to the two exact strings asserted above. Do not change 钱伟长 `years: '1912—2010'`; CF-002 remains unresolved and outside remediation.

- [ ] **Step 4: Run focused GREEN**

```powershell
npx vitest run src/content/content.test.ts
npm run validate:content
```

Expected: exact-copy tests and content validation pass; all Qian IDs and relationships are unchanged.

- [ ] **Step 5: Commit**

```powershell
git add src/content/scientists.ts src/content/events.ts src/content/content.test.ts
git commit -m "fix: narrow conflicting Qian Weichang claims"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer compare CF-005/CF-007 against all four direct URLs, confirm no unsupported travel detail or award year remains, and confirm CF-002 was not changed.

### Task 4: Remove unsupported 李三立 material and correct the event count

**Finding IDs closed:** CF-010, CF-012, CF-013, CF-016, CF-050

**Files:**
- Modify: `src/content/scientists.ts`
- Modify: `src/content/events.ts`
- Modify: `src/content/content.test.ts`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Home.test.tsx`
- Modify: `src/pages/Timeline.test.tsx`

**Interfaces:**
- Consumes: stable scientist/story IDs and the dynamic `events.length` homepage count.
- Produces: 李三立 with two retained research chapters, five total timeline events, and neutral homepage event-count wording.

**Authoritative evidence:** [中国工程院](https://www.cae.cn/cae/html/main/colys/53878278.html), [上海大学](https://news.shu.edu.cn/info/1021/64368.htm). Accessed 2026-08-27. The registered project courseware is provenance evidence only and does not corroborate the 911 technical narrative.

- [ ] **Step 1: Add RED assertions for exact retained content**

Add assertions to `src/content/content.test.ts`:

```ts
const li = scientists.find(({ id }) => id === 'scientist-li-sanli')!;
const chapter724 = li.chapters.find(({ id }) => id === 'chapter-li-develop-724')!;
const liStory = stories.find(({ id }) => id === 'story-li-building-chinese-computers')!;

expect(li.years).toBe('1935—2022');
expect(li.chapters.map(({ id }) => id)).toEqual([
  'chapter-li-develop-724',
  'chapter-li-ziqiang-supercomputers',
]);
expect(chapter724.action).toBe('李三立曾负责研制724机。');
expect(chapter724.significance).toBe(
  '中国工程院记载，724机是20世纪70年代我国各大学中用于国家尖端科技规模最大的计算机。',
);
expect(liStory.summary).toBe(
  '从研制724机到建设“自强”高性能计算平台，持续推动我国计算机事业发展。',
);
expect(events.some(({ id }) => id === 'event-li-911-1964')).toBe(false);
expect(JSON.stringify([li, liStory, events])).not.toMatch(/虚焊|插件没有测试档案|1964年3月/);
```

Update `Home.test.tsx` to expect group `展馆数据`, text `5` and `个时间节点`, and no text `个已核实时间节点`. Update `Timeline.test.tsx` expected headings to omit `911电子管计算机投入运行`.

In the existing core-chapter integrity assertion, change the unsupported blanket `chapters.length >= 3` condition to `chapters.length >= 2`; the new exact 李三立 chapter-ID assertion is the stronger boundary for the intentional deletion, and all three core profiles continue to expose multiple research chapters.

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts src/pages/Home.test.tsx src/pages/Timeline.test.tsx
```

Expected: the old year, 911 chapter/event, broad 724/story copy, six-event assertion, and “已核实” count label fail.

- [ ] **Step 3: Implement the smallest deletions and copy changes**

Set `years: '1935—2022'`. Delete only `chapter-li-rescue-911` and `event-li-911-1964`. For `chapter-li-develop-724`, use:

```ts
problem: '20世纪70年代，我国高校大型计算机研制持续推进。',
action: '李三立曾负责研制724机。',
significance:
  '中国工程院记载，724机是20世纪70年代我国各大学中用于国家尖端科技规模最大的计算机。',
```

Set the story summary to the exact assertion. In `Home.tsx`, change `aria-label="已核实展馆数据"` to `aria-label="展馆数据"` and `个已核实时间节点` to `个时间节点`; keep `<CountUp value={events.length} />` dynamic.

- [ ] **Step 4: Run focused GREEN**

```powershell
npx vitest run src/content/content.test.ts src/pages/Home.test.tsx src/pages/Timeline.test.tsx
npm run validate:content
```

Expected: five events render, 李三立 retains 724 and 自强 chapters, and no unconditional 911 technical claim remains.

- [ ] **Step 5: Commit**

```powershell
git add src/content/scientists.ts src/content/events.ts src/content/content.test.ts src/pages/Home.tsx src/pages/Home.test.tsx src/pages/Timeline.test.tsx
git commit -m "fix: remove unsupported Li Sanli claims"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer verify all five IDs, ensure the project courseware/source records were not deleted, ensure `event-li-911-1964` is the only removed stable content record, and ensure the homepage count is derived from the retained array.

### Task 5: Correct and narrow 黄宏嘉 research content

**Finding IDs closed:** CF-018, CF-020, CF-022, CF-023

**Files:**
- Modify: `src/content/scientists.ts`
- Modify: `src/content/events.ts`
- Modify: `src/content/content.test.ts`
- Modify: `src/pages/Timeline.tsx`
- Modify: `src/pages/Timeline.test.tsx`

**Interfaces:**
- Consumes: stable 黄宏嘉 ID and all retained chapter/event IDs except unsupported chapter `chapter-huang-wave-plate`.
- Produces: conflict-safe “20世纪60年代” display that still sorts before 1980.

**Authoritative evidence:** [中国科学院人物页](https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml), [上海大学成果页](https://www.shu.edu.cn/info/1667/270302.htm), [上海大学教师页](https://scie.shu.edu.cn/Prof/huanghj.htm). Accessed 2026-08-27.

- [ ] **Step 1: Add RED content and chronological-order assertions**

Add to `src/content/content.test.ts`:

```ts
const huang = scientists.find(({ id }) => id === 'scientist-huang-hongjia')!;
const microwave = huang.chapters.find(
  ({ id }) => id === 'chapter-huang-microwave-principles',
)!;
const fiber = huang.chapters.find(({ id }) => id === 'chapter-huang-single-mode-fiber')!;
const microwaveEvent = events.find(({ id }) => id === 'event-huang-microwave-1964')!;

expect(huang.years).toBe('1924—2021');
expect(microwave.action).toBe(
  '20世纪60年代，他把多年学习、实验和思考整理成约百万字的《微波原理》，由科学出版社出版。',
);
expect(microwave.significance).toBe(
  '该书成为国内该领域第一本专著，被国际学界称为一本“为中国人争气的书”。',
);
expect(fiber.action).toBe(
  '1979年，他在上海科学技术大学创建波科学研究实验室；此后带领团队并与上海石英厂等单位合作开展单模光纤研究，研制出我国第一根单模光纤。',
);
expect(huang.chapters.some(({ id }) => id === 'chapter-huang-wave-plate')).toBe(false);
expect(microwaveEvent.dateLabel).toBe('20世纪60年代');
expect(JSON.stringify([huang, microwaveEvent])).not.toMatch(/煤气灶|黄氏波片|1964年出版/);
```

Update `Timeline.test.tsx` to expect the five headings in this order: 钱伟长回国任教、《微波原理》出版、国产单模光纤研制取得进展、新上海大学合并组建、自强3000进入全球TOP500; also assert the microwave event displays `20世纪60年代`.

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts src/pages/Timeline.test.tsx
```

Expected: exact content assertions fail; without a Chinese-century parser, `20世纪60年代` would sort after all four-digit dates.

- [ ] **Step 3: Apply exact wording and sorting support**

Set the asserted year/action/significance/fiber text, delete only `chapter-huang-wave-plate`, and set the event to:

```ts
dateLabel: '20世纪60年代',
title: '《微波原理》出版',
description:
  '约百万字的《微波原理》由科学出版社出版，成为国内该领域第一本专著。',
```

Extend `eventYear` in `Timeline.tsx` after the existing four-digit match:

```ts
const chineseDecade = event.dateLabel.match(/(\d{2})世纪(\d{2})年代/);
if (chineseDecade) {
  return (Number(chineseDecade[1]) - 1) * 100 + Number(chineseDecade[2]);
}
```

- [ ] **Step 4: Run focused GREEN**

```powershell
npx vitest run src/content/content.test.ts src/pages/Timeline.test.tsx
npm run validate:content
```

Expected: exact copy passes, the five events remain chronological, and no unsupported “黄氏波片”/煤气灶 wording remains.

- [ ] **Step 5: Commit**

```powershell
git add src/content/scientists.ts src/content/events.ts src/content/content.test.ts src/pages/Timeline.tsx src/pages/Timeline.test.tsx
git commit -m "fix: narrow Huang Hongjia research claims"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer compare all four IDs against the three official URLs, verify the conflict-safe decade wording, validate the decade arithmetic, and confirm other 黄宏嘉 IDs and archive provenance remain intact.

### Task 6: Correct extended-profile facts and remove unsupported relationships

**Finding IDs closed:** CF-026, CF-028, CF-029, CF-032, CF-034, CF-036, CF-039, CF-040

**Files:**
- Modify: `src/content/scientists.ts`
- Modify: `src/content/content.test.ts`
- Read: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: all eight stable scientist IDs and six stable spirit IDs.
- Produces: corrected years/summary/fields and evidence-backed `spiritIds`; graph/list code continues consuming the same arrays without special cases.

**Authoritative evidence:** [上海大学—孙晋良](https://www.shu.edu.cn/info/1279/50973.htm), [东华大学—孙晋良](https://ictst.dhu.edu.cn/2018/0530/c12891a196439/page.htm), [复旦大学—杨雄里](https://iobs.fudan.edu.cn/2f/84/c49983a733060/page.htm), [上海大学—谢少荣](https://www.shu.edu.cn/info/1055/323495.htm), [上海大学—谢少荣集群研究](https://www.shu.edu.cn/info/1056/350475.htm), [上海大学未来技术学院—岳晓冬](https://ai.shu.edu.cn/info/1073/1557.htm). Accessed 2026-08-27.

- [ ] **Step 1: Add RED exact-record assertions**

Add a table-driven assertion to `src/content/content.test.ts`:

```ts
expect(
  Object.fromEntries(scientists.map((item) => [item.id, item])),
).toMatchObject({
  'scientist-sun-jinliang': {
    years: '1946年生',
    summary:
      '长期从事碳/碳复合材料、特种纤维及特种纺织材料研究，相关成果应用于劳动防护、航空、航天等领域。',
    spiritIds: ['spirit-innovation'],
  },
  'scientist-yang-xiongli': {
    years: '1941年生',
    spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
  },
  'scientist-xie-shaorong': {
    summary:
      '带领团队深耕海洋智能无人艇，研制“精海”系列无人艇并开展无人艇集群研究。',
  },
  'scientist-yue-xiaodong': {
    summary:
      '从事人工智能理论与应用研究，研究方向为机器学习、软计算与决策支持系统。',
    fields: ['机器学习', '软计算', '决策支持系统'],
    spiritIds: ['spirit-innovation', 'spirit-truth-seeking'],
  },
});
```

The existing responsive graph assertion already verifies every relationship points to a theme and the list exactly renders each `spiritIds` array; do not add a second Playwright test.

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts
```

Expected: all four current profiles differ from at least one exact field.

- [ ] **Step 3: Apply only the asserted fields**

Change the four records exactly as asserted. Do not alter names, IDs, slugs, portraits, `featured`, chapters, or Verified relationships belonging to 周邦新 and 谢少荣.

- [ ] **Step 4: Run focused GREEN and graph regression**

```powershell
npx vitest run src/content/content.test.ts src/components/graph/ScientistGraph.test.tsx
npx playwright test tests/e2e/responsive.spec.ts -g "relationship graph defaults"
npm run validate:content
```

Expected: exact records pass, all graph references remain valid, and the mobile readable list reflects the narrowed relationships.

- [ ] **Step 5: Commit**

```powershell
git add src/content/scientists.ts src/content/content.test.ts
git commit -m "fix: correct extended scientist profiles"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer map each of the eight finding IDs to one changed field, confirm removed relationships have no claimed evidence, and confirm no Verified relationship or stable ID changed.

### Task 7: Use the six official science-spirit titles

**Finding IDs closed:** CF-041

**Files:**
- Modify: `src/content/spirit-themes.ts`
- Modify: `src/content/content.test.ts`
- Modify: `src/pages/Spirit.test.tsx`
- Modify: `src/pages/ScientistDetail.test.tsx`
- Modify: `src/components/graph/ScientistGraph.test.tsx` only if a fixture asserts production titles

**Interfaces:**
- Consumes: six stable IDs referenced by scientists, stories, events, activities, archives and media.
- Produces: official titles while summaries, keywords and all ID-based relationships stay unchanged.

**Authoritative evidence:** [科技部转载中共中央办公厅、国务院办公厅《关于进一步弘扬科学家精神加强作风和学风建设的意见》](https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/gfxwj2019/201906/t20190612_147045.html). Accessed 2026-08-27.

- [ ] **Step 1: Add RED title/ID assertions**

Add to `src/content/content.test.ts`:

```ts
expect(spiritThemes.map(({ id, title }) => [id, title])).toEqual([
  ['spirit-patriotism', '胸怀祖国、服务人民'],
  ['spirit-innovation', '勇攀高峰、敢为人先'],
  ['spirit-truth-seeking', '追求真理、严谨治学'],
  ['spirit-dedication', '淡泊名利、潜心研究'],
  ['spirit-collaboration', '集智攻关、团结协作'],
  ['spirit-education', '甘为人梯、奖掖后学'],
]);
```

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts src/pages/Spirit.test.tsx src/components/graph/ScientistGraph.test.tsx
```

Expected: the exact title list fails while ID relationships remain green.

- [ ] **Step 3: Replace only the six title strings**

Apply the exact six title values from the assertion in existing array order. Keep all IDs, summaries, keywords and relationship arrays unchanged; CF-042 is Verified and receives no production change.

Update `Spirit.test.tsx` accessible button names from `胸怀祖国` to `胸怀祖国、服务人民` and from `育人传承` to `甘为人梯、奖掖后学`; keep their query IDs and related-person assertions unchanged.

Update `ScientistDetail.test.tsx` production-title assertions from `胸怀祖国` to `胸怀祖国、服务人民`, `求真务实` to `追求真理、严谨治学`, and the absent `育人传承` heading to absent `甘为人梯、奖掖后学`.

- [ ] **Step 4: Run focused GREEN**

```powershell
npx vitest run src/content/content.test.ts src/pages/Spirit.test.tsx src/pages/ScientistDetail.test.tsx src/components/graph/ScientistGraph.test.tsx
npm run validate:content
```

Expected: the official titles render through existing consumers and every ID reference remains valid.

- [ ] **Step 5: Commit**

```powershell
git add src/content/spirit-themes.ts src/content/content.test.ts src/pages/Spirit.test.tsx src/pages/ScientistDetail.test.tsx src/components/graph/ScientistGraph.test.tsx
git commit -m "fix: use official science spirit titles"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer compare punctuation and order character-for-character with the central document, confirm all six IDs are unchanged, and reject any unrelated summary/keyword rewrite.

### Task 8: Make stale planned activities and missing images explicit

**Finding IDs closed:** CF-043, CF-044, CF-045, CF-046, CF-048

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/activities.ts`
- Modify: `src/content/validate.ts`
- Modify: `src/content/content.test.ts`
- Modify: `src/components/common/ResilientImage.tsx`
- Modify: `src/components/common/ResilientImage.test.tsx`
- Modify: `src/pages/Footprints.tsx`
- Modify: `src/pages/Footprints.test.tsx`
- Modify: `docs/content-guide.md`

**Interfaces:**
- Consumes: the existing four activity IDs/types, `planned` status, participant count 0, and accessible `ResilientImage` fallback.
- Produces: optional `Activity.image`, no pseudo path/source ID, and an immediately visible missing-image fallback.

**Evidence:** The four records and absent public files are documented in `docs/audits/2026-08-27-v1/content-findings.md` and `baseline.md`; no completion record or image source exists as of 2026-08-27.

- [ ] **Step 1: Add RED optional-image and stale-copy tests**

In `src/content/content.test.ts`, replace the assertion requiring every activity image with:

```ts
expect(activities.map(({ id, dateLabel, location, description, status, participantCount, image }) => ({
  id,
  dateLabel,
  location,
  description,
  status,
  participantCount,
  image,
}))).toEqual([
  {
    id: 'activity-branch-outreach-2026',
    dateLabel: '时间待重新确认（原计划2026年7月）',
    location: '计划地点：上海大学宝山校区',
    description: '原计划将科学家事迹整理为微党课、微团课，在党团支部开展宣讲；具体场次人数尚待核验。',
    status: 'planned', participantCount: 0, image: undefined,
  },
  {
    id: 'activity-school-outreach-2026',
    dateLabel: '时间待重新确认（原计划2026年7月）',
    location: '计划地点：上海大学附属小学等学校',
    description: '原计划面向九年义务教育阶段学校开展科学家精神宣讲；具体场次人数尚待核验。',
    status: 'planned', participantCount: 0, image: undefined,
  },
  {
    id: 'activity-community-outreach-2026',
    dateLabel: '时间待重新确认（原计划2026年7月）',
    location: '计划地点：宝山区友谊路街道、普陀区真如街道',
    description: '原计划在爱心暑托班、助老服务课等场合开展宣讲；具体场次人数尚待核验。',
    status: 'planned', participantCount: 0, image: undefined,
  },
  {
    id: 'activity-military-outreach-2026',
    dateLabel: '时间待重新确认（原计划2026年7月）',
    location: '计划地点：南京路上好八连事迹纪念馆等',
    description: '原计划面向部队开展科学家精神宣讲；具体场次人数尚待核验。',
    status: 'planned', participantCount: 0, image: undefined,
  },
]);
expect(validateContent({ scientists, stories, events, archives, activities, media, spiritThemes })).toEqual([]);
```

Add a `ResilientImage.test.tsx` case with `src={undefined}` that expects no `<img>` and an accessible fallback named `计划活动暂缺`. Update `Footprints.test.tsx` to expect four fallback roles on initial render and zero activity `<img>` elements; remove the forced-error test tied to the pseudo path. Change the missing-activity validation fixture to `status: 'completed'` so `MISSING_ACTIVITY_IMAGE` still has a RED boundary.

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/content/content.test.ts src/components/common/ResilientImage.test.tsx src/pages/Footprints.test.tsx
```

Expected: `Activity.image` is required, old July copy/pseudo metadata remains, and `ResilientImage` cannot accept an absent source.

- [ ] **Step 3: Implement optional planned imagery and exact copy**

Change `Activity` to `image?: SourcedImage`. In `validateContent`, emit `MISSING_ACTIVITY_IMAGE` only when a completed activity has no image; if an image exists, run the unchanged non-empty src/alt/source-ID checks.

Change `ResilientImageProps.src` to `src?: string`; render its existing fallback when `!src || failed`, and use `key={props.src ?? 'missing'}`. In `Footprints.tsx`, pass:

```tsx
src={activity.image?.src}
alt={activity.image?.alt ?? activity.title}
fallbackLabel={activity.title}
```

Apply the exact four records asserted above and omit `image` from each. In `docs/content-guide.md`, show a planned example without `image`, state that planned activities without a verified image omit the field and use the fallback, and keep the rule that a completed activity requires a verified image and source registration.

- [ ] **Step 4: Run focused GREEN**

```powershell
npx vitest run src/content/content.test.ts src/components/common/ResilientImage.test.tsx src/pages/Footprints.test.tsx src/content/sources.test.ts
npm run validate:content
```

Expected: four planned records have no pseudo asset/source metadata, four honest fallbacks render immediately, completed-without-image remains invalid, and actual public source registration is unchanged.

- [ ] **Step 5: Commit**

```powershell
git add src/content/types.ts src/content/activities.ts src/content/validate.ts src/content/content.test.ts src/components/common/ResilientImage.tsx src/components/common/ResilientImage.test.tsx src/pages/Footprints.tsx src/pages/Footprints.test.tsx docs/content-guide.md
git commit -m "fix: clarify planned activities and image provenance"
```

- [ ] **Step 6: Independent review**

Have a fresh reviewer verify all five IDs, exact old-plan wording, `planned`/0 invariants, absence of four pseudo paths/source IDs, completed-image validation, and no generated/replacement image.

### Task 9: Raise small-text contrast without changing decorative bronze

**Finding IDs closed:** VP-002, VP-003

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/designSystem.test.ts`
- Modify: `src/pages/About.tsx`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: existing paper `#f3efe7`, dark panel `#171717`, archive `#d5c5a6`, and bronze decoration `#a68452`.
- Produces: `--color-bronze-text: #765a31`; computed contrast >=4.5:1 for every audited small index/label at all five widths.

- [ ] **Step 1: Add RED palette and computed-contrast assertions**

In `src/styles/designSystem.test.ts`, add `#765a31` and RGB channels `118 90 49` to the approved lists, assert `tokens.css` contains `--color-bronze-text: #765a31`, then add a pure relative-luminance assertion that `contrast('#765a31', '#f3efe7') >= 4.5`.

Extend the existing Playwright test `all museum pages avoid horizontal overflow at five acceptance widths` rather than adding a seventeenth test. For the current route and width, inspect these selectors when present:

```ts
const contrastSelectors = [
  '.guide-card__index',
  '.research-chapters__number',
  '.footprints-index span',
  '.about-page__chain li span',
  '.about-page__positioning-label',
];
```

For every matching element, read computed foreground color and the nearest non-transparent ancestor background. Add these exact helpers to `tests/e2e/responsive.spec.ts` and use the returned ratio in the existing route/width loop:

```ts
function colorChannels(value: string): [number, number, number] {
  const rgb = value.match(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];

  const srgb = value.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (srgb) return [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255];
  throw new Error(`Unsupported computed color: ${value}`);
}

function relativeLuminance(value: string): number {
  const [red, green, blue] = colorChannels(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
```

For each matching locator, evaluate upward from the element until `getComputedStyle(node).backgroundColor` is neither `transparent` nor an `rgba` value with alpha 0, return `{ foreground, background }`, and assert `contrastRatio(foreground, background) >= 4.5`. Include selector, route and width in the assertion message.

- [ ] **Step 2: Run RED**

```powershell
npx vitest run src/styles/designSystem.test.ts
npx playwright test tests/e2e/responsive.spec.ts -g "all museum pages avoid horizontal overflow"
```

Expected: the existing small bronze pair is about 3.03:1; the About label is about 2.02:1; the dedicated label class/token do not exist.

- [ ] **Step 3: Apply the scoped visual fix**

Add to `tokens.css`:

```css
--color-bronze-text: #765a31;
```

Use `var(--color-bronze-text)` only in `.guide-card__index`, `.research-chapters__number`, `.footprints-index span`, and `.about-page__chain li span`. Keep borders, graph/timeline strokes, focus outlines, large decoration and collecting-state styling on `--color-bronze`.

Set the About paragraph to:

```tsx
<p className="about-page__positioning-label">项目定位</p>
```

Replace the broad `.about-page > article > p:first-child` member of the red-label selector group with `.about-page__positioning > .about-page__positioning-label`, then ensure the later rule uses the same dedicated selector and `color: var(--color-archive)`. Because the archive rule occurs later with equal specificity, its intended light color wins on the dark panel.

- [ ] **Step 4: Run focused GREEN at all required widths**

```powershell
npx vitest run src/styles/designSystem.test.ts src/pages/About.test.tsx
npx playwright test tests/e2e/responsive.spec.ts -g "all museum pages avoid horizontal overflow"
```

Expected: all affected text is >=4.5:1 at 360, 390, 768, 1024 and 1440; there is no overflow regression; Playwright test count remains 16 in the full suite.

- [ ] **Step 5: Capture local before/after evidence without committing it**

Use the same route, selector and viewport pairs from VP-002/VP-003 to save after screenshots under the ignored SDD visual-evidence directory. Confirm `git status --short` does not list screenshots or test output.

- [ ] **Step 6: Commit**

```powershell
git add src/styles/tokens.css src/styles/components.css src/styles/designSystem.test.ts src/pages/About.tsx tests/e2e/responsive.spec.ts
git commit -m "fix: raise small-text contrast across museum pages"
```

- [ ] **Step 7: Independent review**

Have a fresh reviewer verify both VP IDs, the contrast computation, all five widths, selector specificity, and that decorative bronze and the established visual direction remain unchanged.

### Task 10: Run the complete release gate, merge, deploy, and verify live

**Finding IDs closed:** None; this task verifies all 31 accepted IDs and publishes Tasks 1–9.

**Files:**
- Create: `docs/audits/2026-08-27-v1/release-verification.md`
- Read: `.github/workflows/deploy-pages.yml`
- Read: `docs/audits/2026-08-27-v1/summary.md`
- Read: all files changed by Tasks 1–9

**Interfaces:**
- Consumes: reviewed remediation commits and the existing main-only Pages workflow.
- Produces: a public verification record, merged `main`, successful CI/Pages deployment, and live acceptance evidence.

- [ ] **Step 1: Prove finding-ID uniqueness and repository hygiene**

```powershell
rg -o "CL-[0-9]{3}|CF-[0-9]{3}|VP-[0-9]{3}" docs/superpowers/plans/2026-08-27-v1-audit-remediation.md
$placeholderPattern = ('T' + 'ODO|T' + 'BD|implement ' + 'later|fill ' + 'in|待' + '定')
rg -n $placeholderPattern docs/superpowers/plans/2026-08-27-v1-audit-remediation.md
rg -n "[A-Za-z]:\\" src tests docs .github public package.json vite.config.ts playwright.config.ts
git diff --check
git status --short --branch
```

Expected: the accepted-ID mapping in Tasks 1–9 contains each of CL-001/002/003, CF-005/007/010/012/013/016/018/020/022/023/026/028/029/032/034/036/039/040/041/043/044/045/046/048/050, and VP-001/002/003 exactly once; any additional ID occurrence is explanatory evidence, not a second closing task. No placeholder, new machine path, whitespace error, tracked output, or unintended change is present.

- [ ] **Step 2: Run the clean local release gate**

```powershell
npm ci
npm run check
npx playwright test
```

Expected: clean install succeeds; content, lint, typecheck, all Vitest and production build pass; Playwright reports exactly 16/16 across desktop-chrome and iphone-13.

- [ ] **Step 3: Verify root and repository-base production builds**

```powershell
npm run build
$env:VITE_BASE_PATH='/shu-scientist-museum/'
npm run build
Remove-Item Env:VITE_BASE_PATH
```

Expected: both builds succeed; repository-base `dist/index.html` references `/shu-scientist-museum/` assets and `dist/404.html` embeds the same base. The existing build test also covers `/`, `/museum/`, and `/shu-scientist-museum/`.

- [ ] **Step 4: Perform local visual and interaction acceptance**

Run the production preview and inspect all baseline routes at 360, 390, 768, 1024 and 1440. Verify zero overflow/console/page/same-origin failures, correct titles/H1s, mobile navigation, filters/Back, graph modes, dialog focus/Escape, optional activity fallbacks, collecting media, unknown routes and reduced motion. Recheck that the homepage graph has exactly three in-bounds lines connected to the person/event/spirit node centers.

- [ ] **Step 5: Obtain final independent branch review**

Give a fresh reviewer the diff from the remediation branch base through HEAD plus the spec, summary, all four audit documents, and this plan. Require explicit confirmation that every accepted ID is closed once, CF-002 and all Verified rows are unchanged, no unsupported facts/images were added, the 16-test E2E contract remains intact, and no Critical/Important issue remains.

- [ ] **Step 6: Write and commit the release verification record**

Before writing, run `git merge-base HEAD origin/main` and `git rev-parse HEAD`. Create `docs/audits/2026-08-27-v1/release-verification.md` with title `V1 Audit Remediation Release Verification` and five populated sections: `Revisions`, `Local gates`, `Finding closure`, `GitHub and Pages`, and `Live acceptance`. Copy the two SHA outputs verbatim; for each local command record exit code and exact pass count; for Tasks 1–9 record their finding IDs and independent-review result; for GitHub/Pages record the PR, workflow and deployment URLs; for live acceptance record every Step 8 URL, expected H1 and observed H1. Every field must contain observed evidence before staging, and no local path may appear.

```powershell
git add docs/audits/2026-08-27-v1/release-verification.md
git commit -m "docs: record V1 remediation verification"
```

- [ ] **Step 7: Push a PR and merge only after CI is green**

Push the remediation branch, open a non-draft PR to `main`, include the 31-ID closure table and exact local gate results, and wait for all required checks. Merge only after the final review is clean and CI succeeds; do not bypass a failed check. Record the PR URL, merge SHA and workflow run URL in the verification document if a post-merge documentation commit is needed, otherwise record them in the GitHub release/PR body.

- [ ] **Step 8: Wait for Pages and verify a fresh live context**

After the deploy job succeeds, use a new browser context with no existing session storage or service-worker/cache state. Verify:

```text
https://gauntwheelcake.github.io/shu-scientist-museum/ -> homepage H1
https://gauntwheelcake.github.io/shu-scientist-museum/scientists/qian-weichang -> 钱伟长
https://gauntwheelcake.github.io/shu-scientist-museum/scientists/li-sanli -> 李三立
https://gauntwheelcake.github.io/shu-scientist-museum/scientists/huang-hongjia -> 黄宏嘉
https://gauntwheelcake.github.io/shu-scientist-museum/graph -> 科学家图谱
https://gauntwheelcake.github.io/shu-scientist-museum/media -> 影音档案
https://gauntwheelcake.github.io/shu-scientist-museum/not-a-real-museum-route -> 页面未找到
```

At 390 and 1440 pixels, assert final URL/H1 agreement, zero console/page errors after fallback completion, no failed repository assets, every audited small-text pair >=4.5:1, and all three homepage graph edges remain inside the SVG and meet their intended node centers. Also deny `sessionStorage` in a browser context and verify a deep request still reaches the site root rather than remaining stranded on `404.html`; loss of the deep path is acceptable in this denial case.

- [ ] **Step 9: Close the release only with evidence**

Confirm the public `main` SHA matches the merge, CI and Pages are successful, live checks pass in both widths, and the worktree contains no unintended change. If any live discrepancy appears, reopen only its owning task with a new RED reproduction and do not declare completion until the corrected deployment passes.
