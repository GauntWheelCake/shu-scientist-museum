import { expect, test, type Page } from '@playwright/test';

const coreScientists = [
  { name: '钱伟长', slug: 'qian-weichang' },
  { name: '李三立', slug: 'li-sanli' },
  { name: '黄宏嘉', slug: 'huang-hongjia' },
] as const;

const indexRoutes = [
  '/',
  '/scientists',
  '/timeline',
  '/spirit',
  '/graph',
  '/footprints',
  '/media',
  '/about',
  ...coreScientists.map(({ slug }) => `/scientists/${slug}`),
] as const;

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

async function clickPrimaryNavigation(page: Page, label: string): Promise<void> {
  const desktopNavigation = page.getByRole('navigation', { name: '主导航' });

  if (await desktopNavigation.isVisible()) {
    await desktopNavigation.getByRole('link', { name: label, exact: true }).click();
    return;
  }

  await page.getByRole('button', { name: '打开导航菜单' }).click();
  await page.getByRole('navigation', { name: '移动端导航' })
    .getByRole('link', { name: label, exact: true })
    .click();
}

test('home opens every core profile and each profile returns to the portrait gallery', async ({
  page,
}) => {
  const runtimeErrors = guardRuntimeErrors(page);

  for (const scientist of coreScientists) {
    await page.goto('/');
    await page.getByRole('link', { name: `走近${scientist.name}专题` }).click();
    await expect(page).toHaveURL(new RegExp(`/scientists/${scientist.slug}$`));
    await expect(page.getByRole('heading', { level: 1, name: scientist.name })).toBeVisible();

    await clickPrimaryNavigation(page, '前辈群像');

    await expect(page).toHaveURL(/\/scientists$/);
    await expect(page.getByRole('heading', { level: 1, name: '前辈群像' })).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});

test('visitor can switch between timeline and spirit sections and an invalid address shows 404', async ({
  page,
}) => {
  const runtimeErrors = guardRuntimeErrors(page);
  await page.goto('/timeline');
  await expect(page.getByRole('heading', { level: 1, name: '岁月长河' })).toBeVisible();

  await clickPrimaryNavigation(page, '精神谱系');

  await expect(page).toHaveURL(/\/spirit$/);
  await expect(page.getByRole('heading', { level: 1, name: '精神谱系' })).toBeVisible();

  await page.goto('/not-a-real-museum-route');
  await expect(page.getByRole('heading', { level: 1, name: '页面未找到' })).toBeVisible();
  await expect(page.getByText('404')).toBeVisible();
  await page.getByRole('link', { name: '返回首页' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('追寻前辈榜样');
  expect(runtimeErrors).toEqual([]);
});

test('every visible internal link from museum pages navigates without an unexpected 404', async ({
  page,
  baseURL,
}) => {
  const runtimeErrors = guardRuntimeErrors(page);
  const internalTargets = new Map<string, string>();

  for (const route of indexRoutes) {
    await page.goto(route);
    const links = await page.locator('a[href]:visible').evaluateAll((elements) =>
      elements.map((element) => ({
        href: element.getAttribute('href') ?? '',
        markup: element.outerHTML,
      })),
    );

    for (const { href, markup } of links) {
      const target = new URL(href, baseURL);
      if (target.origin === new URL(baseURL!).origin) {
        const destination = `${target.pathname}${target.search}${target.hash}`;
        if (!internalTargets.has(destination)) {
          internalTargets.set(destination, `${route}: ${markup}`);
        }
      }
    }
  }

  expect(internalTargets.size).toBeGreaterThan(10);
  for (const [target, source] of internalTargets) {
    await page.goto(target);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1, name: '页面未找到' }),
      `visible internal link ${target} from ${source} must not land on 404`,
    ).toHaveCount(0);
  }

  expect(runtimeErrors).toEqual([]);
});
