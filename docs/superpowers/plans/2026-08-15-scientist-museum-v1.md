# 上海大学科学家精神数字展馆 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 当天交付一个可通过 GitHub 协作维护、可部署到 GitHub Pages 并能迁移到 Nginx 的响应式科学家精神数字展馆 V1。

**Architecture:** 使用 Vite + React + TypeScript 构建单一静态前端应用；人物、事件、精神主题、活动和影音数据集中保存在 `src/content`，页面只消费经过校验的内容模型。路由、展馆组件、动效、内容和部署各自独立；所有核心内容在动画、关系图或外部媒体失效时仍可阅读。

**Tech Stack:** Node.js 22、Vite 7、React 19、TypeScript 5、React Router 7、Motion 12、Vitest、Testing Library、Playwright、ESLint、Prettier、GitHub Actions、GitHub Pages、Nginx（正式服务器阶段）。

## Global Constraints

- 视觉定位：红色文化 × 科技档案 × 现代博物馆。
- 配色：深朱红 `#8F1D22`、中国红 `#C52A2F`、米白 `#F3EFE7`、墨黑 `#171717`、旧纸色 `#D5C5A6`、铜金 `#A68452`。
- 动效比例：70% 静态高级感 + 30% 克制动效；必须支持 `prefers-reduced-motion`。
- PC 与移动端内容完整一致；移动端允许减少非必要动效。
- V1 不包含后台、数据库、小程序、完整 GIS 或 WebGL。
- 内容不得伪造；无法核实的统计、影音和档案不展示为既成事实。
- 历史照片使用黑白、低饱和、轻颗粒和高对比；当代实践照片保留彩色。
- `main` 始终可构建；功能与内容通过短期分支和 Pull Request 合并。
- 每个任务必须通过对应测试和 `npm run check` 后提交。

---

## File Map

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/content.yml
│   ├── ISSUE_TEMPLATE/feature.yml
│   ├── pull_request_template.md
│   └── workflows/{ci.yml,deploy-pages.yml}
├── docs/
│   ├── content-guide.md
│   ├── deployment.md
│   └── superpowers/{specs,plans}/
├── public/
│   ├── images/{scientists,archives,activities}/
│   ├── logo.svg
│   ├── og-cover.svg
│   └── 404.html
├── scripts/validate-content.ts
├── src/
│   ├── app/{App.tsx,router.tsx,site-meta.ts}
│   ├── components/
│   │   ├── archive/ArchiveViewer.tsx
│   │   ├── common/{EmptyState,ErrorBoundary,PageIntro,SectionHeading}.tsx
│   │   ├── graph/ScientistGraph.tsx
│   │   ├── layout/{Footer,Header,MobileNav,SkipLink}.tsx
│   │   ├── motion/{CountUp,Reveal,TimelineLine}.tsx
│   │   └── scientist/{ScientistCard,ScientistHero,ScientistTimeline}.tsx
│   ├── content/{activities,archives,events,media,scientists,spirit-themes}.ts
│   ├── content/{content.test,types,validate}.ts
│   ├── hooks/{useDocumentTitle,useReducedMotion}.ts
│   ├── pages/{About,Footprints,Gallery,Graph,Home,Media,NotFound,ScientistDetail,Spirit,Timeline}.tsx
│   ├── styles/{base,components,tokens,utilities}.css
│   ├── test/setup.ts
│   └── main.tsx
├── tests/e2e/{navigation,responsive}.spec.ts
├── CONTRIBUTING.md
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

### Task 1: 工程基础、质量门禁与可移植路由

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `index.html`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx`, `src/test/setup.ts`
- Create: `.gitignore`
- Test: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `App(): JSX.Element`；`appRouter`；脚本 `dev`, `build`, `test`, `lint`, `typecheck`, `check`。
- Consumes: 无。

- [ ] **Step 1: 创建项目清单和固定脚本**

`package.json` 必须包含：

```json
{
  "name": "shanghai-university-scientist-museum",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc -b --pretty false",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

安装运行依赖 `react react-dom react-router-dom motion`，开发依赖 `vite typescript tsx @vitejs/plugin-react eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright @playwright/test prettier`。

- [ ] **Step 2: 写应用外壳的失败测试**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

it('renders the museum landmark', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
```

- [ ] **Step 3: 运行测试并确认失败**

Run: `npm test -- src/app/App.test.tsx`  
Expected: FAIL，原因是 `App` 或布局组件尚不存在。

- [ ] **Step 4: 实现最小应用外壳与路由**

`App.tsx` 只组合 `SkipLink`、`Header`、`Outlet`、`Footer` 和顶层 `ErrorBoundary`。`router.tsx` 定义 `/`、`/scientists`、`/scientists/:slug`、`/timeline`、`/spirit`、`/graph`、`/footprints`、`/media`、`/about` 和 `*`。使用 `createBrowserRouter`，并以 `import.meta.env.BASE_URL` 作为 `basename`。

- [ ] **Step 5: 添加 Git 忽略规则**

`.gitignore` 精确包含：

```gitignore
node_modules/
dist/
coverage/
playwright-report/
test-results/
.env
.env.*
!.env.example
.superpowers/
*.log
```

- [ ] **Step 6: 运行基础门禁**

Run: `npm run lint && npm run typecheck && npm test -- src/app/App.test.tsx && npm run build`  
Expected: 全部通过，`dist/index.html` 存在。

- [ ] **Step 7: 提交**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json eslint.config.js index.html src .gitignore
git commit -m "chore: scaffold museum web application"
```

---

### Task 2: 内容模型、首批数据与一致性校验

**Files:**
- Create: `src/content/types.ts`, `src/content/validate.ts`, `src/content/content.test.ts`
- Create: `src/content/scientists.ts`, `events.ts`, `archives.ts`, `activities.ts`, `media.ts`, `spirit-themes.ts`
- Create: `scripts/validate-content.ts`

**Interfaces:**
- Produces: `Scientist`, `Story`, `TimelineEvent`, `ArchiveItem`, `Activity`, `MediaItem`, `SpiritTheme`；`validateContent(dataset): ValidationIssue[]`；各内容数组。
- Consumes: Task 1 的 Vitest 配置。

- [ ] **Step 1: 定义内容类型**

```ts
export type Scientist = {
  id: string;
  slug: string;
  name: string;
  years: string;
  identity: string;
  summary: string;
  fields: string[];
  spiritIds: string[];
  portrait: string;
  featured: boolean;
  chapters: Array<{ id: string; title: string; problem: string; action: string; significance: string }>;
};
```

其余类型使用稳定 `id`，所有关联字段以 `Ids` 结尾；媒体状态限定为 `'published' | 'collecting'`。

- [ ] **Step 2: 写内容校验失败测试**

测试必须覆盖：重复 ID、重复 slug、三位核心人物缺失、关联人物不存在、影音 `published` 却无 URL、活动人数为负数、图片缺少替代文本。

```ts
expect(validateContent(invalidDataset)).toEqual(expect.arrayContaining([
  expect.objectContaining({ code: 'DUPLICATE_ID' }),
  expect.objectContaining({ code: 'BROKEN_REFERENCE' })
]));
```

- [ ] **Step 3: 运行测试并确认失败**

Run: `npm test -- src/content/content.test.ts`  
Expected: FAIL，原因是验证器尚未实现。

- [ ] **Step 4: 实现验证器并录入内容**

至少录入钱伟长、李三立、黄宏嘉三个完整 `featured` 人物，以及孙晋良、周邦新、杨雄里、谢少荣、岳晓冬五张群像卡。人物事实优先取自 `E:\2026社会实践写word+做网站\实践计划.docx`、四份宣讲 PPT 和往届 PDF；不能确认的年份不写入。

- [ ] **Step 5: 添加独立内容检查脚本**

`scripts/validate-content.ts` 直接导入 `src/content/validate.ts` 和各内容数组，发现问题时逐行输出 `code: path - message` 并以状态码 1 退出。将 `"validate:content": "tsx scripts/validate-content.ts"` 加入 `package.json`，并把它放到 `check` 的第一项。

- [ ] **Step 6: 运行内容测试**

Run: `npm run validate:content && npm test -- src/content/content.test.ts`  
Expected: 两项通过，三位核心人物均有三个以上科研章节。

- [ ] **Step 7: 提交**

```bash
git add src/content scripts/validate-content.ts package.json package-lock.json
git commit -m "feat: add validated museum content model"
```

---

### Task 3: 视觉令牌、全局布局与响应式导航

**Files:**
- Create: `src/styles/tokens.css`, `base.css`, `components.css`, `utilities.css`
- Create: `src/components/layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx`, `SkipLink.tsx`
- Create: `src/components/common/ErrorBoundary.tsx`, `PageIntro.tsx`, `SectionHeading.tsx`, `EmptyState.tsx`
- Create: `src/hooks/useReducedMotion.ts`, `useDocumentTitle.ts`
- Test: `src/components/layout/Header.test.tsx`, `src/hooks/useReducedMotion.test.ts`

**Interfaces:**
- Produces: `Header`, `Footer`, `SkipLink`, `PageIntro`, `SectionHeading`, `EmptyState`；CSS 令牌；`useReducedMotion(): boolean`。
- Consumes: Task 1 路由。

- [ ] **Step 1: 写导航与减少动态效果测试**

验证桌面导航存在七个主栏目，移动菜单按钮具有 `aria-expanded`，Escape 可关闭菜单，`matchMedia('(prefers-reduced-motion: reduce)')` 为真时 Hook 返回真。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/components/layout/Header.test.tsx src/hooks/useReducedMotion.test.ts`  
Expected: FAIL，组件和 Hook 尚不存在。

- [ ] **Step 3: 实现设计令牌**

`tokens.css` 至少提供 `--color-brand:#8f1d22`、`--color-accent:#c52a2f`、`--color-paper:#f3efe7`、`--color-ink:#171717`、`--color-archive:#d5c5a6`、`--color-bronze:#a68452`、字体阶梯、8px 间距阶梯、内容宽度和动画时长。正文优先系统中文字体，标题使用宋体风格字体栈，不依赖当天下载的网络字体。

- [ ] **Step 4: 实现键盘友好的导航与布局**

导航激活态使用 `NavLink`；Logo 从 `/logo.svg` 加载；移动菜单打开后锁定页面滚动，关闭时恢复；页面切换后自动关闭菜单。页脚包含项目名称、栏目快捷入口、资料来源说明和版权年份。

- [ ] **Step 5: 实现全局降级样式**

在 `@media (prefers-reduced-motion: reduce)` 中关闭平滑滚动、过渡和关键帧；为 `:focus-visible` 提供 3px 铜金轮廓；在 360px 宽度下禁止横向溢出。

- [ ] **Step 6: 运行测试与检查**

Run: `npm test -- src/components/layout/Header.test.tsx src/hooks/useReducedMotion.test.ts && npm run typecheck`  
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add src/styles src/components/layout src/components/common src/hooks src/app/App.tsx public/logo.svg
git commit -m "feat: establish museum design system and navigation"
```

---

### Task 4: 首页数字序厅与克制动效

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/components/motion/Reveal.tsx`, `CountUp.tsx`, `TimelineLine.tsx`
- Test: `src/pages/Home.test.tsx`, `src/components/motion/CountUp.test.tsx`

**Interfaces:**
- Produces: `Home`；`Reveal({children, delay?})`；`CountUp({value, suffix?})`；`TimelineLine`。
- Consumes: `scientists`, `events`, `activities`, `spiritThemes`；Task 3 设计系统。

- [ ] **Step 1: 写首页叙事顺序测试**

测试通过标题顺序验证：主题 Hero → 核心人物 → 展馆导览 → 岁月长河 → 精神谱系 → 图谱入口 → 精神足迹 → 影音档案。验证三个核心人物链接可访问，并验证减少动态效果时计数直接显示最终值。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/pages/Home.test.tsx src/components/motion/CountUp.test.tsx`  
Expected: FAIL。

- [ ] **Step 3: 实现首页 Hero**

主标题使用“追寻前辈榜样，筑梦科技自立自强”，副标题使用“上海大学科学家精神数字展馆”。首屏按钮只有“走近前辈”和“了解项目”两个；背景使用经过处理的真实资料或克制的纯 CSS 档案纹理，不使用无来源人物图。

- [ ] **Step 4: 实现首页内容段落**

复用内容数据生成三位人物入口、精选时间轴、六类精神、活动统计和影音状态。关系图入口必须附带文本说明，不能只依赖图形表达。

- [ ] **Step 5: 实现动效组件**

`Reveal` 仅修改透明度和小幅纵向位移；`CountUp` 使用 `requestAnimationFrame`，进入视口后启动，并在 reduced motion 下立即显示结果；组件卸载时取消帧请求。

- [ ] **Step 6: 运行测试与构建**

Run: `npm test -- src/pages/Home.test.tsx src/components/motion/CountUp.test.tsx && npm run build`  
Expected: 通过，首页无未使用变量和类型错误。

- [ ] **Step 7: 提交**

```bash
git add src/pages/Home.tsx src/components/motion src/styles
git commit -m "feat: build immersive museum home page"
```

---

### Task 5: 前辈群像与三位人物专题展

**Files:**
- Create: `src/pages/Gallery.tsx`, `src/pages/ScientistDetail.tsx`
- Create: `src/components/scientist/ScientistCard.tsx`, `ScientistHero.tsx`, `ScientistTimeline.tsx`
- Create: `src/components/archive/ArchiveViewer.tsx`
- Test: `src/pages/Gallery.test.tsx`, `src/pages/ScientistDetail.test.tsx`, `src/components/archive/ArchiveViewer.test.tsx`

**Interfaces:**
- Produces: 人物列表筛选；六段式人物专题；`ArchiveViewer({items, initialId, onClose})`。
- Consumes: Task 2 人物、事件和档案数据；Task 3/4 通用组件。

- [ ] **Step 1: 写人物浏览测试**

覆盖按领域与精神关键词筛选、无结果重置、三位核心人物六个章节标题、无效 slug 进入 404、档案查看器 Escape 关闭与焦点回退。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/pages/Gallery.test.tsx src/pages/ScientistDetail.test.tsx src/components/archive/ArchiveViewer.test.tsx`  
Expected: FAIL。

- [ ] **Step 3: 实现人物卡与筛选**

人物卡默认将历史肖像视觉处理为灰度；Hover/Focus 时轻微放大并降低灰度。卡片始终显示姓名和身份，不能把关键信息只放在 Hover。筛选状态同步到 URL 查询参数 `field` 与 `spirit`。

- [ ] **Step 4: 实现六段式人物专题**

按序渲染人物序章、生平轨迹、科研征途、档案珍藏、精神印记和薪火相传。章节使用统一组件，但每位人物的故事文本来自内容层。页面末尾链接到下一位核心人物。

- [ ] **Step 5: 实现档案查看器与空档案降级**

查看器使用原生 `<dialog>` 或等效可访问模式；展示标题、年份、来源和替代文本。人物没有可公开档案时完全隐藏该章节，并在内容测试中允许空数组。

- [ ] **Step 6: 运行测试与构建**

Run: `npm test -- src/pages/Gallery.test.tsx src/pages/ScientistDetail.test.tsx src/components/archive/ArchiveViewer.test.tsx && npm run build`  
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add src/pages/Gallery.tsx src/pages/ScientistDetail.tsx src/components/scientist src/components/archive src/styles
git commit -m "feat: add scientist gallery and documentary profiles"
```

---

### Task 6: 岁月长河、精神谱系与轻量科学家图谱

**Files:**
- Create: `src/pages/Timeline.tsx`, `src/pages/Spirit.tsx`, `src/pages/Graph.tsx`
- Create: `src/components/graph/ScientistGraph.tsx`
- Test: `src/pages/Timeline.test.tsx`, `src/pages/Spirit.test.tsx`, `src/components/graph/ScientistGraph.test.tsx`

**Interfaces:**
- Produces: 排序时间轴；精神主题反查；`ScientistGraph({scientists, themes})`。
- Consumes: Task 2 的 `events`, `scientists`, `spiritThemes`。

- [ ] **Step 1: 写关系与降级测试**

验证事件按年份升序、精神主题只显示有效故事、图谱节点可通过键盘聚焦、点击人物跳转详情、小屏和脚本降级区存在等价关系列表。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/pages/Timeline.test.tsx src/pages/Spirit.test.tsx src/components/graph/ScientistGraph.test.tsx`  
Expected: FAIL。

- [ ] **Step 3: 实现岁月长河**

按年份分组人物事件、科研成果和校史背景；时间线 CSS 在窄屏切换为单列。只对进入视口的线段添加生长动画，减少动态效果时直接显示完整线条。

- [ ] **Step 4: 实现精神谱系**

六个主题均展示定义、关联人物和真实故事摘要。主题切换使用按钮组并带 `aria-pressed`，URL 查询参数为 `theme`。

- [ ] **Step 5: 实现轻量关系图**

使用可访问 SVG：人物为圆形节点，精神主题为菱形节点，连线仅表达 `spiritIds` 关系；选择节点后高亮邻居并在旁侧显示文本详情。低于 720px 时默认显示关系列表，用户可主动切换图形视图。

- [ ] **Step 6: 运行测试与构建**

Run: `npm test -- src/pages/Timeline.test.tsx src/pages/Spirit.test.tsx src/components/graph/ScientistGraph.test.tsx && npm run build`  
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add src/pages/Timeline.tsx src/pages/Spirit.tsx src/pages/Graph.tsx src/components/graph src/styles
git commit -m "feat: connect timeline spirit themes and scientist graph"
```

---

### Task 7: 精神足迹、影音档案、关于项目与错误页面

**Files:**
- Create: `src/pages/Footprints.tsx`, `src/pages/Media.tsx`, `src/pages/About.tsx`, `src/pages/NotFound.tsx`
- Test: `src/pages/Footprints.test.tsx`, `src/pages/Media.test.tsx`, `src/pages/NotFound.test.tsx`

**Interfaces:**
- Produces: 活动分类、影音状态、项目说明、404 页面。
- Consumes: Task 2 的 `activities`, `media`；Task 3 通用组件。

- [ ] **Step 1: 写页面状态测试**

验证四类活动筛选、覆盖人数只汇总已核实数字、影音 `collecting` 不生成外部链接、404 提供首页与群像入口。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/pages/Footprints.test.tsx src/pages/Media.test.tsx src/pages/NotFound.test.tsx`  
Expected: FAIL。

- [ ] **Step 3: 实现精神足迹**

以地点索引和活动卡替代复杂地图。活动卡显示时间、地点、类型、人物和已核实人数；当代照片保留彩色。分类按钮为“全部、进支部、进校园、进社区、进军营”。

- [ ] **Step 4: 实现影音档案**

`published` 条目打开外部平台前显示平台名称；`collecting` 条目显示“资料整理中”，不使用空 `href`。所有封面都有替代文本。

- [ ] **Step 5: 实现关于项目和 404**

关于页复用申报书中的项目定位、实践链条与团队信息；无法确认的联系方式不显示。404 保持展馆视觉并提供两个恢复入口。

- [ ] **Step 6: 运行测试与构建**

Run: `npm test -- src/pages/Footprints.test.tsx src/pages/Media.test.tsx src/pages/NotFound.test.tsx && npm run build`  
Expected: 通过。

- [ ] **Step 7: 提交**

```bash
git add src/pages/Footprints.tsx src/pages/Media.tsx src/pages/About.tsx src/pages/NotFound.tsx src/styles
git commit -m "feat: add practice media and project pages"
```

---

### Task 8: 素材处理、来源清单与页面元数据

**Files:**
- Modify: `public/images/**`
- Create: `src/content/sources.ts`, `src/app/site-meta.ts`, `public/og-cover.svg`
- Create: `docs/content-guide.md`
- Test: `src/content/sources.test.ts`, `src/app/site-meta.test.ts`

**Interfaces:**
- Produces: `sources` 来源登记；`getPageMeta(pathname)`；内容维护规则。
- Consumes: 现有 `素材/logo.svg` 和 `E:\2026社会实践写word+做网站` 中经检查的资料。

- [ ] **Step 1: 写来源与元数据测试**

验证每个公开档案和历史图片都有来源 ID，所有页面标题包含“上海大学科学家精神数字展馆”，人物页生成各自描述。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/content/sources.test.ts src/app/site-meta.test.ts`  
Expected: FAIL。

- [ ] **Step 3: 整理首版素材**

复制 Logo 到 `public/logo.svg`。从现有 PPTX/PDF 中只提取确实属于项目且能说明来源的图片；输出人物图到 `public/images/scientists/<slug>.webp`，档案图到 `public/images/archives/<source-id>-<year>.webp`，活动图到 `public/images/activities/<yyyy-mm-dd>-<place>-<index>.webp`。每张图在 `sources.ts` 登记原文件、页码或幻灯片号、用途和替代文本。

- [ ] **Step 4: 实现页面元数据**

`useDocumentTitle` 在路由切换时设置标题与描述；`index.html` 设置默认描述、主题色、Open Graph 和中文语言。`og-cover.svg` 使用项目名称和确认配色，不使用无来源照片。

- [ ] **Step 5: 编写内容维护指南**

`docs/content-guide.md` 给出新增人物、故事、活动和媒体的完整字段示例，说明稳定 ID、图片命名、来源登记、验证命令和 Pull Request 校对清单。

- [ ] **Step 6: 运行测试与内容校验**

Run: `npm run validate:content && npm test -- src/content/sources.test.ts src/app/site-meta.test.ts && npm run build`  
Expected: 通过，构建日志无缺失资源警告。

- [ ] **Step 7: 提交**

```bash
git add public src/content/sources.ts src/app/site-meta.ts src/hooks/useDocumentTitle.ts index.html docs/content-guide.md
git commit -m "feat: add sourced museum media and page metadata"
```

---

### Task 9: 端到端验收、移动端与可访问性修复

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/navigation.spec.ts`, `tests/e2e/responsive.spec.ts`
- Modify: 失败测试指向的页面、组件和样式文件

**Interfaces:**
- Produces: PC 1440×900、移动端 390×844 的端到端验收。
- Consumes: Tasks 1–8 的完整应用。

- [ ] **Step 1: 写导航端到端测试**

测试首页进入三位人物、返回群像、切换时间轴与精神谱系、访问无效地址进入 404；断言控制台无错误，所有内部链接响应。

- [ ] **Step 2: 写响应式端到端测试**

在 Desktop Chrome 和 iPhone 13 视口下检查：页面 `scrollWidth <= clientWidth`、移动菜单可操作、关系图具有列表降级、档案对话框可关闭、减少动态效果时内容立即可见。

- [ ] **Step 3: 运行测试并记录真实失败**

Run: `npx playwright install chromium && npm run build && npx playwright test`  
Expected: 首次运行允许出现具体布局或交互失败；不得通过放宽断言掩盖问题。

- [ ] **Step 4: 修复测试暴露的问题**

只修改导致失败的组件和 CSS；对每项修复保留原断言。检查 360、390、768、1024、1440px 宽度和键盘 Tab 顺序。

- [ ] **Step 5: 运行完整质量门禁**

Run: `npm run check && npx playwright test`  
Expected: ESLint、类型、单元测试、构建和端到端测试全部通过。

- [ ] **Step 6: 提交**

```bash
git add playwright.config.ts tests src public
git commit -m "test: verify responsive museum experience"
```

---

### Task 10: GitHub 协作文件、CI 与部署

**Files:**
- Create: `README.md`, `CONTRIBUTING.md`, `docs/deployment.md`
- Create: `.github/pull_request_template.md`
- Create: `.github/ISSUE_TEMPLATE/content.yml`, `.github/ISSUE_TEMPLATE/feature.yml`
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`
- Create: `public/404.html`
- Modify: `vite.config.ts`
- Test: workflow 语法检查、生产构建和本地 SPA 路由检查

**Interfaces:**
- Produces: 新成员启动/贡献说明；Pull Request 门禁；GitHub Pages 发布产物；Nginx 迁移手册。
- Consumes: Task 9 通过的应用。

- [ ] **Step 1: 编写协作文档**

README 包含项目定位、截图位置、技术栈、Node 22 要求、安装/启动/检查/构建命令、目录说明和内容维护入口。CONTRIBUTING 规定分支名 `feat/*`, `content/*`, `fix/*`，Commit 使用 Conventional Commits，PR 必须通过 CI 和至少一名内容复核者。

- [ ] **Step 2: 编写 CI 工作流**

`ci.yml` 在 pull request 和 main push 上使用 Node 22、`npm ci`、`npm run check`。使用 `actions/checkout@v4`、`actions/setup-node@v4`，npm 缓存以 `package-lock.json` 为键。

- [ ] **Step 3: 编写 GitHub Pages 发布工作流**

`deploy-pages.yml` 只在 main 通过 workflow dispatch 或 push 后执行；构建时把仓库名注入 `VITE_BASE_PATH`，上传 `dist`，使用官方 Pages artifact/deploy actions。`vite.config.ts` 读取该变量作为 `base`。

- [ ] **Step 4: 添加 GitHub Pages SPA 回退**

`public/404.html` 把未知路径和查询参数编码到 `sessionStorage` 后重定向至站点根；应用启动时读取并恢复路径。测试 `/scientists/qian-weichang` 刷新后仍进入正确页面。

- [ ] **Step 5: 编写部署手册**

`docs/deployment.md` 分别记录 GitHub Pages 开启步骤与 Nginx 配置。Nginx 必须包含：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~* \.(js|css|png|jpg|jpeg|webp|svg)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
}
```

同时记录 HTTPS、域名解析、发布目录、日志路径、回滚到前一构建包和备份要求。

- [ ] **Step 6: 验证工作流与生产包**

Run: `npm run check`  
Run: `$env:VITE_BASE_PATH='/museum/'; npm run build; Remove-Item Env:VITE_BASE_PATH`  
Expected: 两项通过，`dist/index.html` 的静态资源路径以 `/museum/` 开头。

- [ ] **Step 7: 提交**

```bash
git add README.md CONTRIBUTING.md docs/deployment.md .github public/404.html vite.config.ts src/main.tsx
git commit -m "ci: add collaboration and deployment workflow"
```

- [ ] **Step 8: 创建 GitHub 仓库并发布**

在用户提供 GitHub 所有者和仓库名称后，添加 `origin`、推送 `main`、启用 GitHub Pages 的 GitHub Actions 来源并运行发布工作流。记录公开 URL；如果账号授权尚未提供，则停止在“生产构建已验证”状态，不猜测仓库或代替用户公开发布。

---

## Final Verification

- [ ] Run: `npm ci`
- [ ] Run: `npm run validate:content`
- [ ] Run: `npm run lint`
- [ ] Run: `npm run typecheck`
- [ ] Run: `npm test`
- [ ] Run: `npm run build`
- [ ] Run: `npx playwright test`
- [ ] 手工检查 PC 1440×900 与移动端 390×844 的首页和三个人物页。
- [ ] 检查所有历史图片来源、活动统计、外链和替代文本。
- [ ] 确认 `git status --short` 仅包含用户明确保留的未跟踪素材或为空。
- [ ] 确认 GitHub Pages 公开 URL 可从未登录浏览器打开；无授权时明确记录尚未发布的唯一阻塞项。
