# Task 8 实现报告：素材处理、来源清单与页面元数据

## 状态 / 提交

- 状态：DONE
- 分支：`feat/museum-v1`
- 基线：`ed55813234477153a9e0750cea55abd4c7b81e09`
- 提交：`feat: add sourced museum media and page metadata`（SHA 以任务最终回传为准）
- 远程：未推送

## 完成内容

- 使用 bundled runtime 对 5 份候选 PPTX 的全部 132 张幻灯片和 1 份候选 PDF 的全部 82 页完成只读渲染与视觉核查。
- 仅发布 6 张能够明确对应人物/课件且带 slide locator 的 WebP：三位核心人物图、三份宣讲课件封面。
- 核对并保留 `public/logo.svg`；其 SHA-256 与 `C:/Users/Elmo/Desktop/社会实践宣传网站/素材/logo.svg` 一致。
- 新增逐图来源登记 `sources`，记录来源 ID、原文件、幻灯片号、用途和 alt。
- 新增 `getPageMeta(pathname)`；首页、全部静态页、404 与 8 位人物页都返回包含展馆全名的 title 和非空 description，人物页描述各自独立。
- `useDocumentTitle` 统一接收 `{ title, description }`，路由页面切换时同时更新文档标题和 description meta。
- `index.html` 补齐中文语言、默认 description、精确主题色和 Open Graph；`og-cover.svg` 仅使用确认配色与文字。
- 新增人物、故事、活动、媒体、图片命名、来源登记、验证命令与 PR 校对的完整维护指南。
- 未为五位非核心人物、计划活动或 collecting 媒体生成/冒用图片；这些路径继续由 `ResilientImage` 降级处理。

## 逐文件说明

- `public/images/scientists/qian-weichang.webp`：由钱伟长课件 slide 2 的明确肖像区域裁切并转为 WebP。
- `public/images/scientists/li-sanli.webp`：由李三立课件 slide 2 的明确肖像区域裁切并转为 WebP。
- `public/images/scientists/huang-hongjia.webp`：由黄宏嘉课件 slide 3 的实验室照片区域裁切并转为 WebP。
- `public/images/archives/source-qian-courseware-2026.webp`：钱伟长主题课件 slide 1 封面。
- `public/images/archives/source-li-courseware-2026.webp`：李三立主题课件 slide 1 封面。
- `public/images/archives/source-huang-courseware-2026.webp`：黄宏嘉主题课件 slide 1 封面。
- `src/content/sources.ts`：定义 `SourceKind`、`SourceRecord` 并登记 6 项实际公开资产。
- `src/content/sources.test.ts`：验证档案图片与 sourceId 对应、来源字段完整、公开路径符合合同、历史图来源 ID 唯一。
- `src/app/site-meta.ts`：定义 `SITE_NAME`、`PageMeta`、静态路由元数据、人物动态元数据及安全路径规范化。
- `src/app/site-meta.test.ts`：覆盖 9 类静态/404 路径、8 位人物独立描述，以及路由变化时 title/description 同步更新。
- `src/hooks/useDocumentTitle.ts`：将标题与描述作为同一元数据对象写入 document head，缺少 meta 时创建。
- `src/pages/Home.tsx`：补上首页元数据调用。
- `src/pages/About.tsx`、`Footprints.tsx`、`Gallery.tsx`、`Graph.tsx`、`Media.tsx`、`NotFound.tsx`、`Spirit.tsx`、`Timeline.tsx`：改为消费 `getPageMeta`，统一完整展馆名与页面描述。
- `src/pages/ScientistDetail.tsx`：按 slug 消费人物专属元数据；无效 slug 使用 404 元数据。
- `index.html`：保留 `lang="zh-CN"`，增加默认 description、`#8F1D22` theme-color、OG 类型/语言/标题/描述/图片/图片 alt。
- `public/og-cover.svg`：1200×630 纯文字与几何图形封面，只含 `#8F1D22`、`#C52A2F`、`#F3EFE7`、`#171717`、`#D5C5A6`、`#A68452`。
- `docs/content-guide.md`：完整字段示例、稳定 ID、图片命名、来源登记、状态边界、验证命令和 PR 清单。

## 素材来源清单

| 公开文件 | 原文件 | 定位 | 用途 | alt |
| --- | --- | --- | --- | --- |
| `/images/scientists/qian-weichang.webp` | `演讲ppt/钱伟长：从偏科少年到力学大师.pptx` | slide 2 | 钱伟长人物卡片与人物专题肖像 | 钱伟长肖像 |
| `/images/scientists/li-sanli.webp` | `演讲ppt/李三立：造国产超级计算机.pptx` | slide 2 | 李三立人物卡片与人物专题肖像 | 李三立肖像 |
| `/images/scientists/huang-hongjia.webp` | `演讲ppt/黄宏嘉：一根光纤连通万家 (1).pptx` | slide 3 | 黄宏嘉人物卡片与人物专题照片 | 黄宏嘉在实验室设备旁向学生讲解 |
| `/images/archives/source-qian-courseware-2026.webp` | `演讲ppt/钱伟长：从偏科少年到力学大师.pptx` | slide 1 | 钱伟长主题宣讲课件档案封面 | 钱伟长主题宣讲课件封面 |
| `/images/archives/source-li-courseware-2026.webp` | `演讲ppt/李三立：造国产超级计算机.pptx` | slide 1 | 李三立主题宣讲课件档案封面 | 李三立主题宣讲课件封面 |
| `/images/archives/source-huang-courseware-2026.webp` | `演讲ppt/黄宏嘉：一根光纤连通万家 (1).pptx` | slide 1 | 黄宏嘉主题宣讲课件档案封面 | 黄宏嘉主题宣讲课件封面 |

候选资料全量核查记录：

- `钱伟长：从偏科少年到力学大师.pptx`：27/27 slides。
- `李三立：造国产超级计算机.pptx`：34/34 slides。
- `黄宏嘉：一根光纤连通万家 (1).pptx`：27/27 slides。
- `AI动画里的科学家小故事.pptx`：32/32 slides；为动画/生成式插画内容，不登记为历史照片。
- `追寻前辈榜样，筑梦科技自立自强决赛PPT.pptx`：12/12 slides；含项目过程/现场拼图，但不用于尚未发生的计划活动。
- `【知行杯终版】追寻前辈榜样，筑梦科技自立自强.pdf`：82/82 pages；未提取为本版公开资产。

## TDD RED / GREEN

运行方式：将 bundled Node 目录置于 `PATH`，以 `C:/Users/Elmo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` 调用本机 npm CLI；实际 Node 输出为 `v24.19.0`。

RED 命令：

```text
npm test -- src/content/sources.test.ts src/app/site-meta.test.ts
```

RED 实际输出摘要（exit 1）：

```text
FAIL src/app/site-meta.test.ts
Error: Failed to resolve import "./site-meta"
FAIL src/content/sources.test.ts
Error: Failed to resolve import "./sources"
Test Files 2 failed (2)
```

失败原因与预期一致：生产模块尚未实现，而非断言拼写或测试环境错误。

GREEN 命令：

```text
npm test -- src/content/sources.test.ts src/app/site-meta.test.ts
```

GREEN 实际输出（exit 0）：

```text
✓ src/content/sources.test.ts (3 tests)
✓ src/app/site-meta.test.ts (11 tests)
Test Files 2 passed (2)
Tests 14 passed (14)
```

## 内容校验 / 定向测试 / 构建

要求的组合验证命令：

```text
npm run validate:content
npm test -- src/content/sources.test.ts src/app/site-meta.test.ts
npm run build
```

最终实际输出摘要（exit 0）：

```text
Content validation passed.
Test Files 2 passed (2)
Tests 14 passed (14)
vite v7.3.6 building client environment for production...
✓ 81 modules transformed.
✓ built in 1.30s
```

构建日志无 missing resource warning。

完整检查：

```text
npm run check
```

最终实际输出摘要（exit 0）：

```text
Content validation passed.
eslint . --max-warnings=0
tsc -b --pretty false
Test Files 21 passed (21)
Tests 88 passed (88)
vite v7.3.6 building client environment for production...
✓ 81 modules transformed.
✓ built in 1.31s
```

## 自审

- 对照 brief 检查接口、命名合同、6 个配色值、标题全名、人物独立描述、OG 与维护指南条目。
- 逐张打开 6 个最终 WebP，确认人物身份/课件封面可辨认、裁切无文字侵入或错配；历史人物图由既有 CSS 做灰度/高对比展示。
- `sources.ts` 只登记真实存在的 6 个公开文件，档案 sourceId 与 `archives.ts` 一一对应。
- 未新增活动图片、媒体封面或五位非核心人物图片；没有把 AI 动画当作档案照片。
- `og-cover.svg` 色值去重结果恰为六个确认配色，不含外部图片或未确认色值。
- `git diff` 逐文件复核，无远程写入；`.tmp/` 已在提交前清理。

## Concerns

- 当前 Codex 会话未暴露 `load_workspace_dependencies` 工具；资料渲染使用 brief 指定的同版本 bundled runtime 绝对路径。Presentation helper 在 Windows 中文 stdout 解码处有非致命报错，但五份 PPTX 均生成连续的完整 slide 序列；PDF wrapper 的 Poppler 路径失配，改用同一 runtime 内实际 `native/poppler/Library/bin` 后完成 82 页渲染。
- `sourceFile` 只记录相对于维护者本地资料库根的逻辑路径；资料库根不进入公开合同，维护者需在本地解析并保证对应原文件可访问。

## Fix round 1/5：Important findings

### 状态 / 提交

- 状态：DONE
- 修复提交：`fix: tighten museum asset provenance checks`（SHA 以任务最终回传为准）
- 修复范围：仅来源覆盖与可迁移性、历史图交互态低饱和、三张聚焦来源证据。

### 改动

- `src/content/sources.test.ts`：递归读取 `public/images`，自动枚举磁盘上实际存在的全部 WebP；将真实发布集合与 `sources.assetPath` 精确相等比较并验证唯一性，同时对每条登记使用 `existsSync` 核验公开文件。计划活动和 collecting 媒体当前没有磁盘 WebP，因此不会误判为发布资产。
- `src/content/sources.test.ts`：要求 `sourceFile` 符合 `演讲ppt/...` 或 `模板/...` 的资料库相对逻辑路径，禁止盘符、根路径、用户目录与 `..`。
- `src/content/sources.ts`：六条来源由本机 `E:/...` 绝对路径改为 `演讲ppt/...` 稳定标识，保留 slide locator。
- `docs/content-guide.md`：示例改为资料库相对路径，并明确资料库根只由维护者本地解析，不进入公开内容合同。
- `src/styles/designSystem.test.ts`：新增回归测试，要求卡片 hover 与 focus-within 使用同一历史图规则，且 `grayscale` 不低于 `0.8`。
- `src/styles/components.css`：历史人物卡片交互态由 `grayscale(0.28)` 改为 `grayscale(0.88)`，保留克制缩放和对比度变化。

### TDD RED / GREEN

RED：

```text
npm test -- src/content/sources.test.ts src/styles/designSystem.test.ts
```

实际输出（exit 1）：

```text
Test Files 2 failed (2)
Tests 2 failed | 10 passed (12)
expected sourceFile to match /^(演讲ppt|模板)\/.../
expected 0.28 to be greater than or equal to 0.8
```

来源最小修复后单文件 GREEN：

```text
npm test -- src/content/sources.test.ts
✓ src/content/sources.test.ts (5 tests)
Test Files 1 passed (1)
Tests 5 passed (5)
```

样式最小修复后单文件 GREEN：

```text
npm test -- src/styles/designSystem.test.ts
✓ src/styles/designSystem.test.ts (7 tests)
Test Files 1 passed (1)
Tests 7 passed (7)
```

联合定向 GREEN（含未受影响的 site-meta）：

```text
npm test -- src/content/sources.test.ts src/styles/designSystem.test.ts src/app/site-meta.test.ts
Test Files 3 passed (3)
Tests 23 passed (23)
```

### 聚焦来源证据

证据目录：`.superpowers/sdd/2026-08-15-scientist-museum-v1/task-8-evidence/`。该目录继承 `.superpowers/` 的 gitignore，只保留三张源 slide PNG，不提交；聚焦渲染 helper 已删除。

- `qian-weichang-slide-2.png`：slide 标题为“同学们，我们来认识一位厉害的科学家！”，左侧明确写“故事主角——钱伟长”与“上海大学首任校长”，右侧红底人物肖像即最终 `qian-weichang.webp` 的裁切区域；姓名、身份和照片在同一 slide 核对。
- `li-sanli-slide-2.png`：右侧标题明确写“谁是李三立爷爷？”，左侧黄色圆角框内的黑白证件式肖像即最终 `li-sanli.webp` 的裁切区域；姓名与肖像在同一 slide 核对。
- `huang-hongjia-slide-3.png`：右侧文字明确点名“黄宏嘉爷爷”，左侧照片显示黄宏嘉在实验设备旁向学生讲解；最终 `huang-hongjia.webp` 裁取左侧完整照片区域，人物身份由同一 slide 的名称与场景说明核对。

### 覆盖验证

```text
npm run lint
npm run typecheck
npm run build
```

最终实际输出（exit 0）：lint 零 warning，typecheck 通过，Vite `81 modules transformed`，`built in 1.31s`，无缺失资源 warning。

```text
npm run check
```

最终实际输出（exit 0）：

```text
Content validation passed.
Test Files 21 passed (21)
Tests 91 passed (91)
✓ 81 modules transformed.
✓ built in 1.29s
```

### Concerns

- 聚焦证据为本地审阅材料且按要求不提交；若工作树被清理，需从三份来源课件的相同 slide 重新生成。
- 资料库根不在代码中固定；维护者需在本地将 `演讲ppt/...` 逻辑路径解析到可信资料库并核对文件存在性。
