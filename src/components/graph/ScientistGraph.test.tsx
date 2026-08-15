import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import type { Scientist, SpiritTheme } from '../../content/types';
import { ScientistGraph } from './ScientistGraph';

const themes: SpiritTheme[] = [
  { id: 'theme-a', title: '主题甲', summary: '甲主题定义。', keywords: ['甲'] },
  { id: 'theme-b', title: '主题乙', summary: '乙主题定义。', keywords: ['乙'] },
];

const scientists: Scientist[] = [
  {
    id: 'scientist-a',
    slug: 'scientist-a',
    name: '人物甲',
    years: '1900—1980',
    identity: '甲身份',
    summary: '甲人物简介。',
    fields: ['领域甲'],
    spiritIds: ['theme-a'],
    portrait: '',
    featured: false,
    chapters: [],
  },
  {
    id: 'scientist-b',
    slug: 'scientist-b',
    name: '人物乙',
    years: '',
    identity: '乙身份',
    summary: '乙人物简介。',
    fields: ['领域乙'],
    spiritIds: ['theme-b'],
    portrait: '',
    featured: false,
    chapters: [],
  },
];

function LocationProbe() {
  const location = useLocation();

  return <output aria-label="当前位置">{location.pathname}</output>;
}

function installViewport(matchesMobile: boolean) {
  const mediaQuery = Object.assign(new EventTarget(), {
    addListener: () => undefined,
    matches: matchesMobile,
    media: '(max-width: 719px)',
    onchange: null,
    removeListener: () => undefined,
  }) as MediaQueryList;
  const addEventListener = vi.spyOn(mediaQuery, 'addEventListener');
  const removeEventListener = vi.spyOn(mediaQuery, 'removeEventListener');
  window.matchMedia = vi.fn(() => mediaQuery);

  return {
    addEventListener,
    removeEventListener,
    setMatches(nextMatches: boolean) {
      Object.defineProperty(mediaQuery, 'matches', {
        configurable: true,
        value: nextMatches,
      });
      mediaQuery.dispatchEvent(
        Object.assign(new Event('change'), {
          matches: nextMatches,
          media: mediaQuery.media,
        }),
      );
    },
  };
}

function renderGraph() {
  return render(
    <MemoryRouter>
      <ScientistGraph scientists={scientists} themes={themes} />
      <LocationProbe />
    </MemoryRouter>,
  );
}

it('lets keyboard users select a theme and exposes its connected neighbours', async () => {
  installViewport(false);
  const user = userEvent.setup();
  renderGraph();

  const themeNode = screen.getByRole('button', {
    name: '选择精神主题：主题甲',
  });
  themeNode.focus();
  await user.keyboard('{Enter}');

  expect(themeNode).toHaveAttribute('aria-pressed', 'true');
  expect(
    screen.getByRole('link', { name: '查看人物甲人物详情' }),
  ).toHaveAttribute('data-neighbor', 'true');
  expect(
    screen.getByRole('link', { name: '查看人物乙人物详情' }),
  ).toHaveAttribute('data-neighbor', 'false');
  expect(screen.getByRole('heading', { name: '主题甲' })).toBeVisible();
});

it('keeps the root SVG as a named group so its links and buttons remain separate controls', () => {
  installViewport(false);
  renderGraph();

  const svg = screen.getByTestId('scientist-graph-svg');
  expect(svg).not.toHaveAttribute('role', 'img');
  expect(screen.getByRole('group', { name: /科学家与精神主题关系图/ })).toBe(
    svg,
  );
  expect(
    within(svg).getByRole('link', { name: '查看人物甲人物详情' }),
  ).toBeVisible();
  expect(
    within(svg).getByRole('button', { name: '选择精神主题：主题甲' }),
  ).toBeVisible();
});

it('navigates to a scientist profile from a person node', async () => {
  installViewport(false);
  const user = userEvent.setup();
  renderGraph();

  await user.click(screen.getByRole('link', { name: '查看人物甲人物详情' }));

  expect(screen.getByLabelText('当前位置')).toHaveTextContent(
    '/scientists/scientist-a',
  );
});

it('defaults to the complete text relationship list below 720px and can reveal the graphic', async () => {
  installViewport(true);
  const user = userEvent.setup();
  renderGraph();

  expect(screen.queryByTestId('scientist-graph-svg')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: '选择节点查看关系' }),
  ).not.toBeInTheDocument();
  const fallback = screen.getByRole('region', { name: '完整关系列表' });
  expect(within(fallback).getByText('主题甲')).toBeVisible();
  expect(within(fallback).getByText('主题乙')).toBeVisible();
  expect(
    within(fallback).getByRole('link', { name: '人物甲' }),
  ).toHaveAttribute('href', '/scientists/scientist-a');
  expect(
    within(fallback).getByRole('link', { name: '人物乙' }),
  ).toHaveAttribute('href', '/scientists/scientist-b');

  await user.click(screen.getByRole('button', { name: '切换到图形视图' }));
  expect(screen.getByTestId('scientist-graph-svg')).toBeVisible();
  expect(
    screen.getByRole('heading', { name: '选择节点查看关系' }),
  ).toBeVisible();
});

it('follows breakpoint changes until the user explicitly chooses a view', async () => {
  const viewport = installViewport(false);
  const user = userEvent.setup();
  renderGraph();

  expect(screen.getByTestId('scientist-graph-svg')).toBeVisible();

  act(() => viewport.setMatches(true));
  expect(screen.queryByTestId('scientist-graph-svg')).not.toBeInTheDocument();

  act(() => viewport.setMatches(false));
  expect(screen.getByTestId('scientist-graph-svg')).toBeVisible();

  await user.click(screen.getByRole('button', { name: '切换到列表视图' }));
  act(() => viewport.setMatches(true));
  act(() => viewport.setMatches(false));
  expect(screen.queryByTestId('scientist-graph-svg')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '切换到图形视图' }));
  act(() => viewport.setMatches(true));
  expect(screen.getByTestId('scientist-graph-svg')).toBeVisible();
});

it('removes the viewport listener when the graph unmounts', () => {
  const viewport = installViewport(false);
  const { unmount } = renderGraph();

  const listener = viewport.addEventListener.mock.calls.find(
    ([eventName]) => eventName === 'change',
  )?.[1];
  expect(listener).toBeDefined();

  unmount();

  expect(viewport.removeEventListener).toHaveBeenCalledWith('change', listener);
});
