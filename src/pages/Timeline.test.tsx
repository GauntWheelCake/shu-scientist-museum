import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Timeline } from './Timeline';

it('sorts events by the first stated year while preserving source order within a year', () => {
  render(
    <MemoryRouter>
      <Timeline />
    </MemoryRouter>,
  );

  const events = screen.getAllByRole('article');
  expect(
    events.map((event) => within(event).getByRole('heading').textContent),
  ).toEqual([
    '钱伟长回国任教',
    '911电子管计算机投入运行',
    '《微波原理》出版',
    '国产单模光纤研制取得进展',
    '新上海大学合并组建',
    '自强3000进入全球TOP500',
  ]);
  expect(within(events[3]).getByText('1980年前后')).toBeVisible();
});

it('identifies the people attached to each event without inventing missing links', () => {
  render(
    <MemoryRouter>
      <Timeline />
    </MemoryRouter>,
  );

  const universityEvent = screen
    .getByRole('heading', { name: '新上海大学合并组建' })
    .closest('article');

  expect(universityEvent).not.toBeNull();
  expect(
    within(universityEvent!).getByRole('link', { name: '钱伟长' }),
  ).toHaveAttribute('href', '/scientists/qian-weichang');
  expect(
    within(universityEvent!).getByRole('link', { name: '李三立' }),
  ).toHaveAttribute('href', '/scientists/li-sanli');
  expect(
    within(universityEvent!).queryByText('黄宏嘉'),
  ).not.toBeInTheDocument();
});
