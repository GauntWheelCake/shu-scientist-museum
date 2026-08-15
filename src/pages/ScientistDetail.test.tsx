import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ScientistDetail } from './ScientistDetail';

function renderDetail(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/scientists/${slug}`]}>
      <Routes>
        <Route path="/scientists/:slug" element={<ScientistDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ScientistDetail', () => {
  it.each([
    ['qian-weichang', '钱伟长'],
    ['li-sanli', '李三立'],
    ['huang-hongjia', '黄宏嘉'],
  ])('renders the six-part documentary profile for %s', (slug, name) => {
    renderDetail(slug);

    expect(screen.getByRole('heading', { level: 1, name })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: `${name}肖像` })).toBeInTheDocument();

    const sectionHeadings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);

    expect(sectionHeadings).toEqual([
      '人物序章',
      '生平轨迹',
      '科研征途',
      '档案珍藏',
      '精神印记',
      '薪火相传',
    ]);
    expect(screen.getByRole('link', { name: /下一位核心人物/ })).toBeInTheDocument();
  });

  it('uses a stable portrait fallback and hides unknown years and an empty archive section', () => {
    renderDetail('sun-jinliang');

    expect(screen.queryByText('档案珍藏')).not.toBeInTheDocument();
    expect(document.querySelector('.scientist-hero__years')).toBeNull();

    const portrait = screen.getByRole('img', { name: '孙晋良肖像' });
    fireEvent.error(portrait);

    expect(screen.queryByRole('img', { name: '孙晋良肖像' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '孙晋良肖像暂缺' })).toBeVisible();
  });

  it('only links spirit themes to stories that carry the same validated relationship', () => {
    renderDetail('qian-weichang');

    const spiritSection = screen.getByRole('heading', { name: '精神印记' }).closest('section');
    expect(spiritSection).not.toBeNull();
    expect(within(spiritSection!).getByRole('heading', { name: '胸怀祖国' })).toBeInTheDocument();
    expect(within(spiritSection!).getByRole('heading', { name: '求真务实' })).toBeInTheDocument();
    expect(within(spiritSection!).queryByRole('heading', { name: '育人传承' })).not.toBeInTheDocument();
  });

  it('renders the in-site 404 destination for an invalid scientist slug', () => {
    renderDetail('not-a-scientist');

    expect(screen.getByRole('heading', { level: 1, name: '页面未找到' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回前辈群像' })).toHaveAttribute(
      'href',
      '/scientists',
    );
  });
});
