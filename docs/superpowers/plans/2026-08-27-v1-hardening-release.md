# V1 Hardening Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Commit, review, integrate, deploy, and verify the already-implemented V1 hardening changes without mixing in new audit findings.

**Architecture:** Preserve the reviewed working-tree patch in a dedicated `fix/v1-hardening` branch, verify it with the repository's complete quality gates, then integrate it into `main` and validate the exact GitHub Pages artifact. The existing `feat/museum-v1` branch and the user-owned untracked files in the main checkout remain untouched.

**Tech Stack:** Git, Node.js `>=22.12 <25`, npm, Vite 7, React 19, TypeScript, Vitest, Playwright, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-27-v1-quality-audit-design.md`

## Global Constraints

- Keep the existing “红色文化 × 科技档案 × 现代博物馆” design and information architecture unchanged.
- Stage one contains only the already-reviewed hardening patch; do not add audit-driven feature, content, or visual changes.
- Do not modify or delete the main checkout's untracked `.claude/`, `.worktrees/`, `素材/`, or `docs/上海大学科学家精神数字展馆_V1设计确认.md` entries.
- Use Git author email `145789568+GauntWheelCake@users.noreply.github.com` for new commits.
- Run the original repository commands in an environment with normal filesystem permissions before release; a Vite runner workaround is diagnostic evidence only.
- Do not force-push or rewrite the public `main` history.

---

### Task 1: Preserve and Commit the Reviewed Hardening Patch

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Delete: `.superpowers/sdd/2026-08-15-scientist-museum-v1/task-8-report.md`
- Modify: `docs/superpowers/plans/2026-08-15-scientist-museum-v1.md`
- Modify: `index.html`
- Modify: `src/components/motion/CountUp.test.tsx`
- Modify: `src/content/content.test.ts`
- Create: `src/content/media-url.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/validate.ts`
- Modify: `src/deployment/workflows.test.ts`
- Modify: `src/pages/Home.test.tsx`
- Modify: `src/pages/Media.test.tsx`
- Modify: `src/pages/mediaAction.ts`
- Delete: `task-7-report.md`
- Modify: `tests/build/pages-fallback-build.spec.ts`

**Interfaces:**
- Consumes: the reviewed, uncommitted working tree at `.worktrees/museum-v1`, based on commit `6d4c169b9b840e0fdab31c3d83a5cada9ec80c0b`.
- Produces: branch `fix/v1-hardening` with one intentional hardening commit and no unrelated files.

- [ ] **Step 1: Verify the linked worktree and exact patch boundary**

Run from `C:\Users\Elmo\Desktop\社会实践宣传网站\.worktrees\museum-v1`:

```powershell
git status --short --branch
git diff --check
git diff --name-status
```

Expected: branch `feat/museum-v1`; exactly the 15 paths listed in this task; no cache, `dist`, Playwright output, or user source material.

- [ ] **Step 2: Create the release branch without discarding the working tree**

```powershell
git switch -c fix/v1-hardening
git status --short --branch
```

Expected: the same 15 path changes on `fix/v1-hardening`.

- [ ] **Step 3: Run the focused hardening tests**

```powershell
npx vitest run src/components/motion/CountUp.test.tsx src/content/content.test.ts src/deployment/workflows.test.ts src/pages/Home.test.tsx src/pages/Media.test.tsx tests/build/pages-fallback-build.spec.ts
```

Expected: 6 test files and 43 tests pass, including real builds for `/`, `/museum/`, and `/shu-scientist-museum/`.

- [ ] **Step 4: Run the complete local quality gate**

```powershell
npm run check
npx playwright test
```

Expected: content validation, ESLint, TypeScript, 25 Vitest files with 114 tests, production build, and 16 Playwright tests all pass with exit code 0.

- [ ] **Step 5: Verify public-repository hygiene**

```powershell
git grep -n -E 'C:[/\\]Users[/\\]Elmo|E:[/\\]|\.worktrees[/\\]museum-v1|AppData[/\\](Local|Roaming)' -- ':!package-lock.json'
git ls-files '.superpowers/**' 'task-7-report.md' 'dist/**' 'node_modules/**' 'test-results/**' 'playwright-report/**'
```

Expected: no local absolute path match; neither internal report nor generated output remains in the intended index.

- [ ] **Step 6: Commit only the reviewed patch**

```powershell
git add -- .github/workflows/deploy-pages.yml docs/superpowers/plans/2026-08-15-scientist-museum-v1.md index.html src/components/motion/CountUp.test.tsx src/content/content.test.ts src/content/media-url.ts src/content/types.ts src/content/validate.ts src/deployment/workflows.test.ts src/pages/Home.test.tsx src/pages/Media.test.tsx src/pages/mediaAction.ts tests/build/pages-fallback-build.spec.ts
git add -u -- .superpowers/sdd/2026-08-15-scientist-museum-v1/task-8-report.md task-7-report.md
git -c user.name='GauntWheelCake' -c user.email='145789568+GauntWheelCake@users.noreply.github.com' commit -m 'fix: harden V1 release gates and media links'
git status --short
```

Expected: one commit and a clean linked worktree.

### Task 2: Independently Review the Hardening Commit

**Files:**
- Read: `docs/superpowers/specs/2026-08-27-v1-quality-audit-design.md`
- Read: `docs/superpowers/plans/2026-08-27-v1-hardening-release.md`
- Read: the Task 1 commit diff
- Create locally ignored: `.superpowers/sdd/2026-08-27-v1-hardening-release/task-1-report.md`

**Interfaces:**
- Consumes: the Task 1 base and head SHAs.
- Produces: a reviewer verdict with no open Critical or Important finding.

- [ ] **Step 1: Generate a review package over the Task 1 range**

```powershell
bash "$env:USERPROFILE/.codex/plugins/cache/openai-curated-remote/superpowers/6.3.0/skills/subagent-driven-development/scripts/review-package" docs/superpowers/plans/2026-08-27-v1-hardening-release.md 6d4c169 HEAD .superpowers/sdd/2026-08-27-v1-hardening-release/task-1-review.diff
```

Expected: one review package containing only the hardening commit.

- [ ] **Step 2: Review exact release contracts**

The reviewer must verify:

```text
- deploy-pages runs npm run check with VITE_BASE_PATH=/shu-scientist-museum/ and uploads that same dist
- Pages permissions are job-scoped
- og:image resolves correctly for all three tested bases
- mediaAction and content validation share the HTTPS predicate
- malformed, http, javascript, data, and relative media URLs are rejected
- CountUp and Home regression tests cannot pass after the documented mutations
- internal reports and local absolute paths are absent from the public diff
```

Expected: `APPROVE`, or a scoped fix-and-re-review loop until no Critical or Important finding remains.

### Task 3: Integrate, Deploy, and Verify Stage One

**Files:**
- Read: `.github/workflows/ci.yml`
- Read: `.github/workflows/deploy-pages.yml`
- Read: `README.md`
- No new product files unless the remote workflow exposes a verified defect.

**Interfaces:**
- Consumes: reviewed `fix/v1-hardening`.
- Produces: updated remote `main`, successful CI and Pages runs, and an online verification record.

- [ ] **Step 1: Use the finishing workflow to select integration**

Run `superpowers:finishing-a-development-branch`, confirm `main` as the base, and present its required three integration options. Execute the user's choice without force-pushing.

- [ ] **Step 2: Verify remote branch SHAs after integration**

```powershell
gh api repos/GauntWheelCake/shu-scientist-museum/branches/main --jq '.commit.sha'
gh run list --repo GauntWheelCake/shu-scientist-museum --limit 10 --json workflowName,status,conclusion,headSha,url
```

Expected: remote `main` points to the integrated result; CI and Pages runs for that SHA complete successfully.

- [ ] **Step 3: Verify the deployed Pages artifact**

Open `https://gauntwheelcake.github.io/shu-scientist-museum/` and verify:

```text
- HTTP success and correct Chinese page title
- /shu-scientist-museum/scientists/qian-weichang deep link restores correctly
- logo, scientist portrait, CSS, JS, and og-cover.svg load under the repository base
- desktop navigation and the 390px mobile menu work
- no pageerror, console.error, or failed same-origin resource request
```

Expected: stage-one release is healthy. Record exact workflow URLs and any environment limitation.

