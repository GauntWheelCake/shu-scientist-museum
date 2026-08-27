import { fireEvent, render, screen } from '@testing-library/react';
import { withBasePath } from '../../app/publicAsset';
import { ResilientImage } from './ResilientImage';

describe('ResilientImage', () => {
  it('renders an accessible fallback immediately when the source is absent', () => {
    render(
      <ResilientImage
        src={undefined}
        alt="计划活动"
        fallbackLabel="计划活动"
      />,
    );

    expect(
      screen.queryByRole('img', { name: '计划活动' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: '计划活动暂缺' })).toBeVisible();
  });

  it('requests a new image after the src prop changes from a failed source', () => {
    const { rerender } = render(
      <ResilientImage
        src="/images/first.webp"
        alt="人物肖像"
        fallbackLabel="人物"
      />,
    );

    fireEvent.error(screen.getByRole('img', { name: '人物肖像' }));
    expect(
      screen.getByRole('img', { name: '人物肖像暂缺' }),
    ).toBeInTheDocument();

    rerender(
      <ResilientImage
        src="/images/second.webp"
        alt="人物肖像"
        fallbackLabel="人物"
      />,
    );

    expect(screen.getByRole('img', { name: '人物肖像' })).toHaveAttribute(
      'src',
      withBasePath('/images/second.webp'),
    );
    expect(
      screen.queryByRole('img', { name: '人物肖像暂缺' }),
    ).not.toBeInTheDocument();

    rerender(
      <ResilientImage
        src="/images/first.webp"
        alt="人物肖像"
        fallbackLabel="人物"
      />,
    );

    expect(screen.getByRole('img', { name: '人物肖像' })).toHaveAttribute(
      'src',
      withBasePath('/images/first.webp'),
    );
  });
});
