import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter } from 'react-router-dom';
import { beforeEach } from 'vitest';
import { Header } from './Header';

const primaryNavigationItems = [
  '首页',
  '前辈群像',
  '岁月长河',
  '精神谱系',
  '科学家图谱',
  '精神足迹',
  '影音档案',
];

function installDesktopViewport(initiallyDesktop: boolean): {
  update: (matches: boolean) => void;
} {
  const mediaQuery = Object.assign(new EventTarget(), {
    matches: initiallyDesktop,
    media: '(min-width: 68rem)',
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
  }) as MediaQueryList;

  window.matchMedia = (query) => {
    if (query === mediaQuery.media) {
      return mediaQuery;
    }

    return Object.assign(new EventTarget(), {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
    }) as MediaQueryList;
  };

  return {
    update(matches: boolean) {
      Object.defineProperty(mediaQuery, 'matches', { configurable: true, value: matches });
      const event = Object.assign(new Event('change'), { matches, media: mediaQuery.media });
      mediaQuery.dispatchEvent(event);
    },
  };
}

beforeEach(() => {
  installDesktopViewport(false);
  document.body.style.overflow = '';
});

function renderHeader(): void {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

it('provides all seven primary museum sections in the desktop navigation', () => {
  renderHeader();

  const navigation = screen.getByRole('navigation', { name: '主导航' });

  for (const item of primaryNavigationItems) {
    expect(navigation).toHaveTextContent(item);
  }
});

it('reports the mobile menu state and closes it when Escape is pressed', async () => {
  const user = userEvent.setup();
  renderHeader();

  const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  await user.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('navigation', { name: '移动端导航' })).toBeInTheDocument();

  await user.keyboard('{Escape}');
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(menuButton).toHaveFocus();
  expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument();
});

it('locks page scrolling only while the mobile menu is open', async () => {
  const user = userEvent.setup();
  document.body.style.overflow = 'auto';
  renderHeader();

  await user.click(screen.getByRole('button', { name: '打开导航菜单' }));
  expect(document.body.style.overflow).toBe('hidden');

  await user.keyboard('{Escape}');
  expect(document.body.style.overflow).toBe('auto');
});

it('closes an open mobile menu after navigation elsewhere in the app', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/']}>
      <Header />
      <Link to="/timeline">测试页面切换</Link>
    </MemoryRouter>,
  );

  const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
  await user.click(menuButton);
  await user.click(screen.getByRole('link', { name: '测试页面切换' }));

  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
});

it('closes the menu and restores scrolling when crossing from below to the exact desktop boundary', async () => {
  const user = userEvent.setup();
  const viewport = installDesktopViewport(false);
  document.body.style.overflow = 'auto';
  renderHeader();

  const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
  await user.click(menuButton);
  expect(document.body.style.overflow).toBe('hidden');

  act(() => viewport.update(true));

  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('auto');
});
