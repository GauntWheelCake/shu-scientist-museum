import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { Gallery } from './Gallery';

function LocationProbe() {
  const location = useLocation();

  return <output aria-label="当前查询参数">{location.search}</output>;
}

function HistoryControls() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(-1)}>
      返回上一组筛选
    </button>
  );
}

function renderGallery(entry = '/scientists') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Gallery />
      <LocationProbe />
      <HistoryControls />
    </MemoryRouter>,
  );
}

describe('Gallery', () => {
  it('filters by field and spirit while keeping both choices in the URL', async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.selectOptions(screen.getByLabelText('学科领域'), '应用数学');
    expect(screen.getByRole('link', { name: /钱伟长/ })).toBeInTheDocument();
    expect(screen.queryByText('李三立')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('精神关键词'), 'spirit-truth-seeking');

    expect(screen.getByLabelText('当前查询参数')).toHaveTextContent(
      '?field=%E5%BA%94%E7%94%A8%E6%95%B0%E5%AD%A6&spirit=spirit-truth-seeking',
    );
    expect(screen.getByRole('link', { name: /钱伟长/ })).toBeInTheDocument();
  });

  it('restores filters from the URL and offers a reset when no portraits match', async () => {
    const user = userEvent.setup();
    renderGallery('/scientists?field=%E5%BA%94%E7%94%A8%E6%95%B0%E5%AD%A6&spirit=spirit-innovation');

    expect(screen.getByLabelText('学科领域')).toHaveValue('应用数学');
    expect(screen.getByLabelText('精神关键词')).toHaveValue('spirit-innovation');
    expect(screen.getByRole('heading', { name: '未找到符合条件的人物' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '重置筛选' }));

    expect(screen.getByLabelText('当前查询参数')).toHaveTextContent('');
    expect(screen.getAllByRole('article')).toHaveLength(8);
  });

  it('pushes each user filter choice so Back restores the previous filter group', async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.selectOptions(screen.getByLabelText('学科领域'), '应用数学');
    await user.selectOptions(screen.getByLabelText('精神关键词'), 'spirit-truth-seeking');
    await user.click(screen.getByRole('button', { name: '返回上一组筛选' }));

    expect(screen.getByLabelText('学科领域')).toHaveValue('应用数学');
    expect(screen.getByLabelText('精神关键词')).toHaveValue('');
    expect(screen.getByLabelText('当前查询参数')).toHaveTextContent(
      '?field=%E5%BA%94%E7%94%A8%E6%95%B0%E5%AD%A6',
    );
  });

  it('pushes reset so Back restores the filters the user cleared', async () => {
    const user = userEvent.setup();
    renderGallery();

    await user.selectOptions(screen.getByLabelText('学科领域'), '应用数学');
    await user.selectOptions(screen.getByLabelText('精神关键词'), 'spirit-innovation');
    await user.click(screen.getByRole('button', { name: '重置筛选' }));
    await user.click(screen.getByRole('button', { name: '返回上一组筛选' }));

    expect(screen.getByLabelText('学科领域')).toHaveValue('应用数学');
    expect(screen.getByLabelText('精神关键词')).toHaveValue('spirit-innovation');
  });

  it('keeps identity visible, hides unknown years, and replaces failed portraits without a broken image', () => {
    renderGallery();

    const sunCard = screen.getByText('孙晋良').closest('article');
    expect(sunCard).not.toBeNull();
    expect(within(sunCard!).getByText('中国工程院院士，复合材料专家')).toBeVisible();
    expect(sunCard!.querySelector('.scientist-card__years')).toBeNull();

    const portrait = within(sunCard!).getByRole('img', { name: '孙晋良肖像' });
    fireEvent.error(portrait);

    expect(within(sunCard!).queryByRole('img', { name: '孙晋良肖像' })).not.toBeInTheDocument();
    expect(within(sunCard!).getByRole('img', { name: '孙晋良肖像暂缺' })).toBeVisible();
  });
});
