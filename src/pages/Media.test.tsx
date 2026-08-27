import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Media } from './Media';
import { mediaAction } from './mediaAction';

describe('Media', () => {
  it('labels collecting materials honestly and does not give them external links', () => {
    render(
      <MemoryRouter>
        <Media />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('资料整理中')).toHaveLength(3);
    expect(screen.queryByRole('link', { name: /打开.*平台/ })).not.toBeInTheDocument();
  });

  it('builds a safe, named external action only for published media', () => {
    expect(
      mediaAction({
        id: 'published',
        title: '公开课程',
        kind: 'video',
        status: 'published',
        description: '已公开资料。',
        platform: '哔哩哔哩',
        url: 'https://www.bilibili.com/video/BV1xx411c7mD/',
        image: '/images/media/published.webp',
        alt: '公开课程封面',
        scientistIds: [],
        spiritIds: [],
      }),
    ).toEqual({
      label: '在哔哩哔哩打开',
      href: 'https://www.bilibili.com/video/BV1xx411c7mD/',
    });
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<h1>unsafe</h1>',
    'http://example.com/video',
    'not a url',
  ])('does not expose a media action for non-https URL %s', (url) => {
    expect(
      mediaAction({
        id: 'unsafe',
        title: '不安全公开课程',
        kind: 'video',
        status: 'published',
        description: '用于验证链接协议。',
        platform: '示例平台',
        url,
        image: '/images/media/unsafe.webp',
        alt: '不安全公开课程封面',
        scientistIds: [],
        spiritIds: [],
      }),
    ).toBeNull();
  });

  it('replaces a failed cover with an honest fallback', () => {
    render(
      <MemoryRouter>
        <Media />
      </MemoryRouter>,
    );

    const image = screen.getByRole('img', { name: '钱伟长主题微课影音资料征集封面' });
    fireEvent.error(image);

    expect(screen.getByRole('img', { name: '钱伟长主题微课影音资料征集封面暂缺' })).toBeVisible();
  });
});
