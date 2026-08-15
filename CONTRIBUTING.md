# 贡献指南

## 开始之前

请使用 Node 22，在新分支上运行 `npm ci`。内容变更必须先阅读 `docs/content-guide.md`，不得把无法核实的事实、统计、外链或图片作为已确认内容发布。

## 分支与提交

- 功能分支：`feat/<short-name>`
- 内容分支：`content/<short-name>`
- 修复分支：`fix/<short-name>`

Commit 使用 Conventional Commits，例如 `feat: add scientist timeline`、`content: correct archive source`、`fix: restore pages route`、`docs: clarify deployment`。每个提交只处理一个可说明的主题，不提交 `dist/`、测试报告、环境变量或本地资料库文件。

## 开发与验证

```bash
npm ci
npm run dev
npm run check
npx playwright test
```

界面变更应检查 1440×900 与 390×844；内容变更应检查来源、状态、外链、替代文本和移动端呈现。新增来源资料后，可在本机使用显式资料库根运行 `npm run validate:sources -- --root "<source-library>"`。

## Pull Request 门禁

Pull Request 必须：

1. 清楚说明变更、验证证据和影响页面；界面变更附截图，内容变更附来源定位。
2. 通过仓库 CI，即 `npm ci` 与 `npm run check`。
3. 涉及交互或布局时通过 Playwright，并完成 PC、移动端人工检查。
4. 至少获得一名内容复核者确认；涉及事实、数字、图片或外链时，该复核不得由提交者本人代替。
5. 解决所有阻塞性 review 意见后再合并。

请勿在 Issue、PR、Commit 或仓库中上传未获授权的个人信息和内部材料。
