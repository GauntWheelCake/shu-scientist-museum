# 上海大学科学家精神数字展馆

面向公众的响应式数字展馆，以可追溯的史料呈现上海大学科学家的科研选择、育人实践与精神谱系。首版同时支持 PC 与移动端，包含人物群像、三位核心人物专题、时间轴、精神主题、关系图谱、社会实践足迹和影音档案。

## 项目预览

- 线上地址：GitHub Pages 发布后记录在本节。
- 验收截图统一存放在 `docs/screenshots/`，文件名采用 `<page>-<desktop|mobile>.webp`；首版上线验收后补充。

## 技术栈与环境

- React 19、TypeScript、React Router、Motion
- Vite 7、Vitest、Testing Library、Playwright
- Node.js `>=22.12 <25`（仓库 `.nvmrc` 指定 22）

## 本地启动

```bash
npm ci
npm run dev
```

常用质量命令：

```bash
npm run validate:content
npm run lint
npm run typecheck
npm test
npm run build
npm run check
npx playwright test
```

`npm run check` 依次执行内容校验、代码检查、类型检查、单元测试与生产构建。端到端测试需要本机可运行 Chromium。

## 目录

```text
src/app/          路由、页面元数据与应用入口
src/components/   布局、人物、档案、图谱和动效组件
src/content/      人物、事件、活动、影音与来源登记
src/pages/        展馆页面
public/images/    经来源登记的公开图片
tests/e2e/        PC 与移动端端到端验收
docs/             内容维护和部署手册
.github/          协作模板与自动化工作流
```

内容或素材变更请先阅读 [`docs/content-guide.md`](docs/content-guide.md)，逐项登记来源并运行内容校验。协作流程见 [`CONTRIBUTING.md`](CONTRIBUTING.md)，发布与服务器迁移见 [`docs/deployment.md`](docs/deployment.md)。

## 构建路径

默认构建部署在站点根目录。部署到仓库子路径时传入以 `/` 开始和结束的 base path：

```powershell
$env:VITE_BASE_PATH='/shu-scientist-museum/'
npm run build
Remove-Item Env:VITE_BASE_PATH
```
