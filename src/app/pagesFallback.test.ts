import { restorePagesRoute } from './pagesFallback';

const storageKey = 'museum:pages-route';

describe('GitHub Pages SPA fallback', () => {
  it('restores the saved route inside the configured base path exactly once', () => {
    const values = new Map([
      [
        storageKey,
        JSON.stringify({
          pathname: '/scientists/qian-weichang',
          search: '?from=archive',
          hash: '#chapter',
        }),
      ],
    ]);
    const replacements: string[] = [];
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
    };

    restorePagesRoute({
      baseUrl: '/shu-scientist-museum/',
      storage,
      replace: (url) => replacements.push(url),
    });
    restorePagesRoute({
      baseUrl: '/shu-scientist-museum/',
      storage,
      replace: (url) => replacements.push(url),
    });

    expect(replacements).toEqual([
      '/shu-scientist-museum/scientists/qian-weichang?from=archive#chapter',
    ]);
    expect(values.has(storageKey)).toBe(false);
  });

  it('restores a saved route without a protocol-relative URL at the site root', () => {
    const values = new Map([
      [storageKey, JSON.stringify({ pathname: '/scientists/qian-weichang' })],
    ]);
    const replacements: string[] = [];

    restorePagesRoute({
      baseUrl: '/',
      storage: {
        getItem: (key) => values.get(key) ?? null,
        removeItem: (key) => values.delete(key),
      },
      replace: (url) => replacements.push(url),
    });

    expect(replacements).toEqual(['/scientists/qian-weichang']);
  });

  it('discards malformed or external saved routes', () => {
    const replacements: string[] = [];

    for (const value of ['not-json', JSON.stringify({ pathname: '//evil.example/path' })]) {
      const values = new Map([[storageKey, value]]);
      restorePagesRoute({
        baseUrl: '/shu-scientist-museum/',
        storage: {
          getItem: (key) => values.get(key) ?? null,
          removeItem: (key) => values.delete(key),
        },
        replace: (url) => replacements.push(url),
      });
      expect(values.has(storageKey)).toBe(false);
    }

    expect(replacements).toEqual([]);
  });
});
