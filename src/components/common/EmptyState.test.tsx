import { render, screen, within } from '@testing-library/react';
import { EmptyState } from './EmptyState';

it('gives each empty state a unique accessible title relationship', () => {
  render(
    <>
      <EmptyState title="人物未找到" description="请重置人物筛选。" />
      <EmptyState title="档案整理中" description="公开资料仍在核实。" />
    </>,
  );

  const regions = screen.getAllByRole('region');
  const firstTitleId = regions[0].getAttribute('aria-labelledby');
  const secondTitleId = regions[1].getAttribute('aria-labelledby');

  expect(firstTitleId).toBeTruthy();
  expect(secondTitleId).toBeTruthy();
  expect(firstTitleId).not.toBe(secondTitleId);
  expect(within(regions[0]).getByRole('heading', { name: '人物未找到' })).toHaveAttribute(
    'id',
    firstTitleId,
  );
  expect(within(regions[1]).getByRole('heading', { name: '档案整理中' })).toHaveAttribute(
    'id',
    secondTitleId,
  );
});
