import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import { withBasePath } from '../app/publicAsset';
import { appRoutes } from '../app/router';
import { Home } from './Home';

function installReducedMotionPreference(matches: boolean): void {
  const mediaQuery = Object.assign(new EventTarget(), {
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    matches,
    addListener: () => undefined,
    removeListener: () => undefined,
  }) as MediaQueryList;

  window.matchMedia = () => mediaQuery;
}

it('presents the museum narrative in the approved order', () => {
  installReducedMotionPreference(true);
  const { container } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  const sectionHeadings = [...container.querySelectorAll('h1, h2')].map(
    (heading) => heading.textContent,
  );

  expect(sectionHeadings).toEqual([
    '追寻前辈榜样，筑梦科技自立自强',
    '核心人物',
    '展馆导览',
    '岁月长河',
    '精神谱系',
    '图谱入口',
    '精神足迹',
    '影音档案',
  ]);
});

it.each([
  '核心人物',
  '展馆导览',
  '岁月长河',
  '精神谱系',
  '图谱入口',
  '精神足迹',
  '影音档案',
])('gives the %s section an accessible name', (name) => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  expect(screen.getByRole('region', { name })).toBeInTheDocument();
});

it('serves the digital foyer at the configured root route', async () => {
  installReducedMotionPreference(true);
  const root = withBasePath('/');
  const router = createMemoryRouter(appRoutes, {
    basename: root,
    initialEntries: [root],
  });
  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: '追寻前辈榜样，筑梦科技自立自强',
    }),
  ).toBeInTheDocument();
});

it('offers exactly two hero calls to action', () => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  const hero = screen.getByRole('region', {
    name: '追寻前辈榜样，筑梦科技自立自强',
  });
  const links = within(hero).getAllByRole('link');

  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAccessibleName('走近前辈');
  expect(links[0]).toHaveAttribute('href', '/scientists');
  expect(links[1]).toHaveAccessibleName('了解项目');
  expect(links[1]).toHaveAttribute('href', '/about');
});

it.each([
  ['钱伟长', '/scientists/qian-weichang'],
  ['李三立', '/scientists/li-sanli'],
  ['黄宏嘉', '/scientists/huang-hongjia'],
])('links the core profile for %s', (name, href) => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: new RegExp(`走近${name}`) })).toHaveAttribute(
    'href',
    href,
  );
});

it('labels planned practice separately from completed activity', () => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  const status = screen.getByRole('group', { name: '实践活动状态' });
  const planned = within(status).getByText('计划实践路线').closest('div');
  const completed = within(status).getByText('已记录完成活动').closest('div');

  expect(planned).not.toBeNull();
  expect(within(planned!).getByText('4')).toBeInTheDocument();
  expect(completed).not.toBeNull();
  expect(within(completed!).getByText('0')).toBeInTheDocument();
});

it('reports the retained timeline-event count without claiming every event is verified', () => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  const facts = screen.getByRole('group', { name: '展馆数据' });
  const eventCount = within(facts).getByText('个时间节点').closest('div');

  expect(eventCount).not.toBeNull();
  expect(within(eventCount!).getByText('5')).toBeInTheDocument();
  expect(within(facts).queryByText('个已核实时间节点')).not.toBeInTheDocument();
});

it('explains the relationship graph in text', () => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  expect(
    screen.getByText('通过人物、科学事件与精神主题之间的关联，发现跨越年代的共同选择。'),
  ).toBeInTheDocument();
});

it('connects every graph preview edge to the declared node centers', () => {
  installReducedMotionPreference(true);
  const { container } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  const preview = container.querySelector('.graph-preview');
  const nodes = new Map(
    [...(preview?.querySelectorAll('[data-graph-node]') ?? [])].map((node) => [
      node.getAttribute('data-graph-node'),
      [node.getAttribute('cx'), node.getAttribute('cy')],
    ]),
  );
  const edges = [...(preview?.querySelectorAll('[data-from][data-to]') ?? [])];

  expect(nodes.size).toBe(3);
  expect(edges).toHaveLength(3);
  for (const edge of edges) {
    expect([edge.getAttribute('x1'), edge.getAttribute('y1')]).toEqual(
      nodes.get(edge.getAttribute('data-from')),
    );
    expect([edge.getAttribute('x2'), edge.getAttribute('y2')]).toEqual(
      nodes.get(edge.getAttribute('data-to')),
    );
  }
});
