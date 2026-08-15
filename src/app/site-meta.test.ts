import { render } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { scientists } from '../content/scientists';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getPageMeta, SITE_NAME } from './site-meta';

const staticPaths = [
  '/',
  '/scientists',
  '/timeline',
  '/spirit',
  '/graph',
  '/footprints',
  '/media',
  '/about',
  '/not-a-page',
];

describe('getPageMeta', () => {
  it.each(staticPaths)('returns the full museum name and a description for %s', (pathname) => {
    const meta = getPageMeta(pathname);

    expect(meta.title).toContain('上海大学科学家精神数字展馆');
    expect(meta.description.trim()).not.toHaveLength(0);
  });

  it('returns a distinct description for every scientist page', () => {
    const descriptions = scientists.map((scientist) => {
      const meta = getPageMeta(`/scientists/${scientist.slug}`);

      expect(meta.title).toBe(`${scientist.name}｜${SITE_NAME}`);
      expect(meta.description).toContain(scientist.name);
      expect(meta.description).toContain(scientist.summary);
      return meta.description;
    });

    expect(new Set(descriptions).size).toBe(scientists.length);
  });
});

function MetadataHarness({ pathname }: { pathname: string }) {
  useDocumentTitle(getPageMeta(pathname));
  return null;
}

describe('useDocumentTitle', () => {
  it('updates both title and description when the route changes', () => {
    const { rerender } = render(createElement(MetadataHarness, { pathname: '/' }));

    expect(document.title).toBe(getPageMeta('/').title);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      getPageMeta('/').description,
    );

    rerender(createElement(MetadataHarness, { pathname: '/scientists/qian-weichang' }));

    expect(document.title).toBe(getPageMeta('/scientists/qian-weichang').title);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      getPageMeta('/scientists/qian-weichang').description,
    );
  });
});
