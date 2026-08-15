import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/scientists',
  '/scientists/qian-weichang',
  '/scientists/li-sanli',
  '/scientists/huang-hongjia',
  '/timeline',
  '/spirit',
  '/graph',
  '/footprints',
  '/media',
  '/about',
  '/invalid-address',
] as const;

const widths = [360, 390, 768, 1024, 1440] as const;

function guardRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`);
    }
  });

  return errors;
}

test('all museum pages avoid horizontal overflow at five acceptance widths', async ({ page }) => {
  const runtimeErrors = guardRuntimeErrors(page);

  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 });
    for (const route of routes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        bodyClientWidth: document.body.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        rootClientWidth: document.documentElement.clientWidth,
        rootScrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions, `${route} must fit within ${width}px`).toEqual(
        expect.objectContaining({
          bodyClientWidth: dimensions.bodyScrollWidth,
          rootClientWidth: dimensions.rootScrollWidth,
        }),
      );
    }
  }

  expect(runtimeErrors).toEqual([]);
});

test('mobile navigation opens, closes with Escape, restores focus, and navigates by keyboard', async ({
  page,
}) => {
  const runtimeErrors = guardRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳至主要内容' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '上海大学科学家精神数字展馆首页' })).toBeFocused();
  await page.keyboard.press('Tab');

  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  await expect(menuButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: '移动端导航' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: '移动端导航' })).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const firstMenuLink = page.getByRole('navigation', { name: '移动端导航' })
    .getByRole('link', { name: '首页', exact: true });
  await expect(firstMenuLink).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('navigation', { name: '移动端导航' })
      .getByRole('link', { name: '岁月长河', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/timeline$/);
  await expect(page.getByRole('heading', { level: 1, name: '岁月长河' })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('relationship graph defaults to its complete readable list on mobile', async ({ page }) => {
  const runtimeErrors = guardRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/graph');

  await expect(page.getByTestId('scientist-graph-svg')).toHaveCount(0);
  const relationships = page.getByRole('region', { name: '完整关系列表' });
  await expect(relationships).toBeVisible();
  for (const name of ['钱伟长', '李三立', '黄宏嘉']) {
    await expect(relationships.getByRole('link', { name, exact: true })).toBeVisible();
  }

  await page.getByRole('button', { name: '切换到图形视图' }).click();
  await expect(page.getByTestId('scientist-graph-svg')).toBeVisible();
  await page.getByRole('button', { name: '切换到列表视图' }).click();
  await expect(page.getByTestId('scientist-graph-svg')).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('native archive dialog closes by keyboard and button and restores trigger focus', async ({ page }) => {
  const runtimeErrors = guardRuntimeErrors(page);
  await page.goto('/scientists/qian-weichang');

  const trigger = page.getByRole('button', { name: '查看档案' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('open', true);
  await expect(page.getByRole('button', { name: '关闭档案查看器' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole('button', { name: '关闭档案查看器' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(runtimeErrors).toEqual([]);
});

test.describe('reduced motion', () => {
  test('reveal and timeline content is immediately in its final visible state', async ({ page }) => {
    const runtimeErrors = guardRuntimeErrors(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    ).toBe(true);

    const reveals = page.locator('.reveal');
    await expect(reveals.first()).toHaveCSS('opacity', '1');
    expect(await reveals.count()).toBeGreaterThan(5);
    for (const reveal of await reveals.all()) {
      await expect(reveal).toHaveCSS('opacity', '1');
      await expect(reveal).toHaveCSS('transform', 'none');
    }

    await page.goto('/timeline');
    await expect(page.locator('.timeline-line__progress')).toHaveCSS(
      'transform',
      'matrix(1, 0, 0, 1, 0, 0)',
    );
    await expect(page.getByRole('heading', { name: '人物、科研与校史节点' })).toBeVisible();
    expect(runtimeErrors).toEqual([]);
  });
});
