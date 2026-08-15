# 上海大学科学家精神数字展馆内容维护指南

本指南用于新增或修订人物、故事、活动、影音与图片来源。内容必须来自已核实材料；无法核实的统计、影音地址、活动结果和人物照片不得作为既成事实发布。

## 稳定 ID 与状态

- ID 一经发布不得因标题润色而改变；关联字段只引用 ID，不复制名称。
- ID 使用小写英文、数字和连字符。人物为 `scientist-<slug>`，故事为 `story-<slug>`，事件为 `event-<slug>-<year>`，档案为 `archive-<slug>`，活动为 `activity-<slug>-<year>`，媒体为 `media-<slug>`，来源为 `source-<slug>`。
- 人物 `slug` 同样保持稳定，人物页路径为 `/scientists/<slug>`。
- 未完成活动必须为 `status: 'planned'`、`participantCount: 0`；未核实公开地址的影音必须为 `status: 'collecting'`，且不填写 `url` 或 `platform`。

## 新增人物

在 `src/content/scientists.ts` 中加入完整记录：

```ts
{
  id: 'scientist-example-name',
  slug: 'example-name',
  name: '示例姓名',
  years: '', // 未确认时留空，不能猜测
  identity: '经来源核实的身份说明',
  summary: '经来源核实的人物摘要。',
  fields: ['研究领域一', '研究领域二'],
  spiritIds: ['spirit-truth-seeking'],
  portrait: '/images/scientists/example-name.webp',
  featured: false,
  chapters: [
    {
      id: 'chapter-example-name-research-topic',
      title: '科研章节标题',
      problem: '当时面对的明确问题。',
      action: '人物采取的可核实行动。',
      significance: '材料能够支持的意义，不扩大推断。',
    },
  ],
}
```

若没有可明确认定且可公开使用的真实照片，仍保留约定路径，让 `ResilientImage` 显示降级内容；不得生成或冒用“示意肖像”。

## 新增故事

故事与人物共用 `src/content/scientists.ts` 中的 `stories`：

```ts
{
  id: 'story-example-name-key-choice',
  slug: 'example-name-key-choice',
  title: '经核实的故事标题',
  summary: '说明人物在具体情境中的选择，不添加材料没有记载的对白或细节。',
  scientistIds: ['scientist-example-name'],
  spiritIds: ['spirit-patriotism', 'spirit-truth-seeking'],
}
```

所有 `scientistIds` 与 `spiritIds` 必须指向已存在记录。

## 新增活动

在 `src/content/activities.ts` 中加入完整记录。图片名必须严格为 `/images/activities/<yyyy-mm-dd>-<place>-<index>.webp`：

```ts
{
  id: 'activity-example-campus-2026',
  title: '校园宣讲（计划）',
  dateLabel: '2026年8月（计划）',
  location: '待核实的具体地点',
  description: '计划开展的内容；不写未发生的成效。',
  participantCount: 0,
  status: 'planned',
  type: 'school',
  image: {
    src: '/images/activities/2026-08-01-example-campus-01.webp',
    alt: '校园宣讲现场的客观画面说明',
    sourceId: 'source-example-campus-2026-08-01',
  },
  scientistIds: ['scientist-example-name'],
  spiritIds: ['spirit-education'],
}
```

只有活动实际完成且日期、地点、人数和图片均已核实后，才可改为 `completed`。计划活动没有真实现场图时保留降级展示，不使用往期或其他地点照片代替。

## 新增影音

在 `src/content/media.ts` 中加入完整记录：

```ts
{
  id: 'media-example-interview',
  title: '示例访谈',
  kind: 'video',
  status: 'published',
  description: '可从公开内容核实的简介。',
  platform: '发布平台名称',
  url: 'https://example.edu/video/verified-id',
  image: '/images/media/example-interview.webp',
  alt: '示例访谈封面',
  scientistIds: ['scientist-example-name'],
  spiritIds: ['spirit-education'],
}
```

如果公开地址、发布主体或授权状态任一项未核实，改用 `status: 'collecting'` 并删除 `platform`、`url`；不得制作虚假的播放入口或封面。

## 图片命名、处理与来源登记

- 人物图片：`public/images/scientists/<slug>.webp`。
- 档案图片：`public/images/archives/<source-id>-<year>.webp`。
- 活动图片：`public/images/activities/<yyyy-mm-dd>-<place>-<index>.webp`。
- 媒体封面：`public/images/media/<stable-media-slug>.webp`。
- 历史照片使用黑白或低饱和、高对比的克制处理；现有页面通过 CSS 统一处理人物历史图。当代社会实践照片保留彩色，不改变事实内容。
- 不把 AI 生成图、插画或无法识别人物与场景的图片登记为历史照片或活动照片。

每个实际发布的图片都要在 `src/content/sources.ts` 中逐图登记：

```ts
{
  id: 'source-example-name-portrait',
  kind: 'historical-photo',
  assetPath: '/images/scientists/example-name.webp',
  sourceFile: '演讲ppt/人物主题课件.pptx',
  locator: 'slide 7', // PDF 使用 'page 7'
  usage: '人物卡片与人物专题肖像',
  alt: '示例人物在实验室工作',
}
```

`sourceFile` 是相对于维护者本地“资料库根”的稳定逻辑路径，不写盘符、用户目录、绝对路径或 `..`；资料库根只在本地解析，不进入公开内容合同。它必须指向实际检查过的原文件，`locator` 必须是逐页核验后的幻灯片号或 PDF 页码，`usage` 和 `alt` 必须与最终公开文件一致。删除公开图片时同步删除来源登记；替换图片时保留历史审查记录并更新 locator。

## 验证命令

使用项目要求的 Node 版本（`>=22.12 <25`）运行：

```bash
npm run validate:content
npm test -- src/content/sources.test.ts src/app/site-meta.test.ts
npm run check
```

维护者另行校验本地来源资料库时，显式传入资料库根：

```bash
npm run validate:sources -- --root "D:/path/to/source-library"
```

该命令会把每条相对 `sourceFile` 安全解析到给定根目录内，拒绝路径逃逸并检查原文件真实存在。它不会加入 `npm run check`，避免 CI 或没有本地资料库的协作者依赖外部磁盘。

构建日志不得出现缺失资源 warning。浏览人物、档案、活动和媒体页面，确认 PC 与移动端展示同一组完整内容，并在启用 `prefers-reduced-motion` 时确认信息不依赖动画才能出现。

## Pull Request 校对清单

- [ ] 所有事实、年份、身份、数字、影音地址和活动状态均有可复核材料。
- [ ] 新 ID 与 slug 唯一、稳定，所有关联 ID 有对应记录。
- [ ] 人物、故事、活动和媒体字段完整，计划/征集状态没有伪装成已完成/已发布。
- [ ] 图片按目录合同命名，公开图片逐张登记原文件、slide/page、用途与 alt。
- [ ] 五位非核心人物、计划活动和 collecting 媒体没有伪造照片或封面。
- [ ] 历史图片低饱和且可读，当代活动图片保持彩色；文字对比度与替代文本合格。
- [ ] 页面 title 含“上海大学科学家精神数字展馆”，description 与当前页面内容一致。
- [ ] PC 与移动端内容完整一致，减少动态效果时仍可读取全部信息。
- [ ] `npm run validate:content`、定向测试和 `npm run check` 全部通过，构建无缺失资源 warning。
