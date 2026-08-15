import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

it('offers home and scientist-gallery recovery paths', () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '页面未找到' })).toBeVisible();
  expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: '浏览前辈群像' })).toHaveAttribute('href', '/scientists');
});
