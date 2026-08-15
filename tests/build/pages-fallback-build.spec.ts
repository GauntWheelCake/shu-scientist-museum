// @vitest-environment node
import { readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { build } from 'vite';

const outputRoot = resolve('test-results', `pages-fallback-build-${Date.now()}`);

afterAll(() => {
  rmSync(outputRoot, { force: true, recursive: true });
});

describe('built GitHub Pages fallback', () => {
  it.each(['/', '/museum/', '/shu-scientist-museum/'])(
    'uses the same %s base as the application build',
    async (basePath) => {
      const previousBase = process.env.VITE_BASE_PATH;
      process.env.VITE_BASE_PATH = basePath;
      const outDir = resolve(outputRoot, basePath.replaceAll('/', '-') || 'root');

      try {
        await build({
          build: { outDir },
          configFile: resolve('vite.config.ts'),
          logLevel: 'silent',
        });
      } finally {
        if (previousBase === undefined) delete process.env.VITE_BASE_PATH;
        else process.env.VITE_BASE_PATH = previousBase;
      }

      const fallback = readFileSync(resolve(outDir, '404.html'), 'utf8');
      const declaredBase = fallback.match(/const basePath = (["'])(.*?)\1;/)?.[2];
      expect(declaredBase).toBe(basePath);

      const script = fallback.match(/<script>([\s\S]*?)<\/script>/)?.[1];
      const stored = new Map<string, string>();
      let redirectedTo = '';
      const deepPath = `${basePath}scientists/qian-weichang`.replace('//', '/');

      Function('window', script!)({
        location: {
          pathname: deepPath,
          search: '?from=archive',
          hash: '#chapter',
          replace: (value: string) => {
            redirectedTo = value;
          },
        },
        sessionStorage: {
          setItem: (key: string, value: string) => stored.set(key, value),
        },
      });

      expect(redirectedTo).toBe(basePath);
      expect(JSON.parse(stored.get('museum:pages-route')!)).toEqual({
        pathname: '/scientists/qian-weichang',
        search: '?from=archive',
        hash: '#chapter',
      });
    },
    30_000,
  );
});
