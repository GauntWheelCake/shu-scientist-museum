import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, RouterProvider } from 'react-router-dom';
import { appRouter } from '../app/router';
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

it('serves the digital foyer at the root route', async () => {
  installReducedMotionPreference(true);
  await appRouter.navigate('/');
  render(<RouterProvider router={appRouter} />);

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
  expect(within(status).getByText('4')).toBeInTheDocument();
  expect(within(status).getByText('计划实践路线')).toBeInTheDocument();
  expect(within(status).getByText('0')).toBeInTheDocument();
  expect(within(status).getByText('已记录完成活动')).toBeInTheDocument();
});

it('groups verified museum counts under an accessible label', () => {
  installReducedMotionPreference(true);
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

  expect(screen.getByRole('group', { name: '已核实展馆数据' })).toBeInTheDocument();
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
