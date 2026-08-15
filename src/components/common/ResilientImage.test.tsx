import { fireEvent, render, screen } from '@testing-library/react';
import { ResilientImage } from './ResilientImage';

describe('ResilientImage', () => {
  it('requests a new image after the src prop changes from a failed source', () => {
    const { rerender } = render(
      <ResilientImage src="/images/first.webp" alt="人物肖像" fallbackLabel="人物" />,
    );

    fireEvent.error(screen.getByRole('img', { name: '人物肖像' }));
    expect(screen.getByRole('img', { name: '人物肖像暂缺' })).toBeInTheDocument();

    rerender(
      <ResilientImage src="/images/second.webp" alt="人物肖像" fallbackLabel="人物" />,
    );

    expect(screen.getByRole('img', { name: '人物肖像' })).toHaveAttribute(
      'src',
      '/images/second.webp',
    );
    expect(screen.queryByRole('img', { name: '人物肖像暂缺' })).not.toBeInTheDocument();

    rerender(
      <ResilientImage src="/images/first.webp" alt="人物肖像" fallbackLabel="人物" />,
    );

    expect(screen.getByRole('img', { name: '人物肖像' })).toHaveAttribute(
      'src',
      '/images/first.webp',
    );
  });
});
