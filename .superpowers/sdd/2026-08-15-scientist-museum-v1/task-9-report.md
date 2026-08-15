# Task 9 实现报告：端到端验收、移动端与可访问性

## 状态 / 接管

- 状态：DONE
- 分支：`feat/museum-v1`
- 基线：`cb80394f9a2dfb0fc1db9cac24093b791d208f90`
- 提交：`test: verify responsive museum experience`（SHA 以任务最终回传为准）
- 远程：未推送
- 接管状态：前代理失去响应时留下未跟踪的 `playwright.config.ts` 与 `tests/`；除此以外工作树相对基线无改动。

## 接管诊断

- `git status --short`：`?? playwright.config.ts`、`?? tests/`。
- Playwright API 返回 Chromium 路径 `C:/Users/Elmo/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe`，缓存文件存在，未下载浏览器、未使用网络。
- 使用指定 bundled Node `v24.19.0` 直接调用 Playwright CLI 执行 `test --list`：exit 0，发现 2 个项目、2 个 spec、16 个测试。
- 沙箱用户无法遍历工作树父目录，Vite/esbuild 在沙箱内报 `EPERM`；后续构建与浏览器测试按工具授权在沙箱外执行，应用和测试本身不依赖提权。

## 前代理文件审查

- `playwright.config.ts` 定义 1440×900 desktop Chrome 与 390×844 iPhone 13 两个项目，禁止 `test.only`、零重试并保留失败 trace；覆盖符合 brief。
- `navigation.spec.ts` 覆盖首页进入钱伟长、李三立、黄宏嘉专题，返回前辈群像，时间轴切换精神谱系，无效路由进入 404，以及已知页面全部可见内部链接；每项均监听 `console.error` 与 `pageerror`。
- `responsive.spec.ts` 覆盖 360/390/768/1024/1440 五档宽度的 body/root 横向溢出、移动菜单 Tab/Enter/Escape/焦点恢复、图谱移动端完整列表和图形/列表切换、原生档案 dialog 的 Escape/按钮关闭及焦点恢复、reduced-motion 最终可见状态。
- 未发现 `skip`、条件放宽、软断言或掩盖失败。保留 2 项审查修正：配置中机器专属 Node 绝对路径不可移植；内部链接采集错误地把 SVG `<a>` 当作 HTML anchor 读取 `.href`。

## RED、根因与最小修复

### RED 1：SVG 内部链接被测试误判

命令：`npm run build && npx playwright test`（bundled Node 调用 npm/npx CLI）。

实际输出摘要（exit 1）：

```text
✓ built in 1.35s
1 failed, 15 passed (33.2s)
visible internal link /[object%20Object] must not land on 404
```

诊断重跑将来源记录为 `/graph`。该 SVG `<a>` 的实际标记为 `href="/scientists/qian-weichang"`，但 SVG anchor 的 `.href` 是 `SVGAnimatedString`；测试强转 `HTMLAnchorElement` 后交给 `new URL()`，对象被字符串化为 `[object Object]`。生产链接没有损坏。

最小修复：使用 `element.getAttribute('href')` 读取真实 DOM 属性，并以 `Map<destination, source markup>` 保留来源页面与元素标记，使今后的失败可直接定位。定向 GREEN：`1 passed (7.2s)`。

### RED 2：Vitest 误收集 Playwright spec

首次完整 `npm run check` 的实际输出摘要（exit 1）：

```text
Content validation passed.
eslint / typecheck passed.
21 unit-test files, 94 tests passed.
2 suites failed: tests/e2e/navigation.spec.ts, tests/e2e/responsive.spec.ts
Playwright Test did not expect test() to be called here.
```

根因是 Vitest 默认 `*.spec.ts` 收集规则包含新建 `tests/e2e/`。最小修复是在既有 Vite/Vitest 配置中显式设置 `include: ['src/**/*.test.{ts,tsx}']`，保持现有单测目录合同且不改变任何断言。定向 GREEN：`21 files / 94 tests passed`。

### 配置可移植性

将 `playwright.config.ts` 的本机 bundled Node 绝对路径替换为 `process.execPath`。Playwright web server 因而使用启动当前测试 runner 的同一 Node，可跨机器运行且仍满足本次 bundled Node 验收。

生产页面、组件和 CSS 在真实 E2E RED 中没有失败，因此未修改 `src/` 或样式。

## 最终验证

实际运行：将 bundled Node 目录置于 `PATH`，以 bundled Node 调用本机 npm/npx CLI，执行等价的要求命令：

```text
npm run check && npx playwright test
```

最终实际输出（exit 0）：

```text
Content validation passed.
eslint . --max-warnings=0
tsc -b --pretty false
Test Files 21 passed (21)
Tests 94 passed (94)
✓ 81 modules transformed.
✓ built in 1.25s
Running 16 tests using 8 workers
16 passed (30.6s)
```

E2E 实际覆盖两个项目：desktop Chrome 1440×900、iPhone 13 390×844；额外溢出矩阵为 360/390/768/1024/1440。

## 自审

- 对照 brief 逐项核对人物/群像/时间轴/精神谱系/404、console/pageerror、内部链接、五档宽度、移动菜单键盘、图谱列表、dialog、焦点恢复与 reduced-motion。
- 测试使用真实浏览器、真实路由和真实 DOM；没有 mock、skip、重试、断言放宽或生产测试钩子。
- `git diff --check`、暂存 diff 与 `git status --short` 在提交前复核；没有加入 `dist/`、`test-results/`、trace、浏览器缓存或 npm 缓存。
- 改动限定为 Playwright 配置、两个 E2E spec、Vitest 收集边界与本报告；未推送。

## Concerns

- Playwright/Vite 子进程会输出 `NO_COLOR` 被 `FORCE_COLOR` 覆盖的非致命 Node warning；不影响退出码、页面 console 监听或 16 项结果。
- 受 Codex 沙箱父目录访问限制，本次实际验证经批准在沙箱外运行；浏览器缓存已预先存在，过程中没有网络下载。
