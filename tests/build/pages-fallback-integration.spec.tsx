import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp } from '../../src/app/bootstrap';

const basePath = '/shu-scientist-museum/';
const outputRoot = resolve('test-results', `pages-fallback-integration-${Date.now()}`);

let fallbackScript = '';

beforeAll(() => {
  execFileSync(
    process.execPath,
    [
      resolve('node_modules/vite/bin/vite.js'),
      'build',
      '--outDir',
      outputRoot,
      '--logLevel',
      'silent',
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, VITE_BASE_PATH: basePath },
      stdio: 'pipe',
    },
  );

  const fallback = readFileSync(resolve(outputRoot, '404.html'), 'utf8');
  fallbackScript = fallback.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  expect(fallbackScript).not.toBe('');
}, 30_000);

afterAll(() => {
  rmSync(outputRoot, { force: true, recursive: true });
});

describe('GitHub Pages fallback bootstrap', () => {
  it.each([
    ['/scientists/qian-weichang', '钱伟长'],
    ['/not-a-real-museum-route', '页面未找到'],
  ] as const)('restores %s before rendering its route', async (pathname, heading) => {
    const values = new Map<string, string>();
    let redirectedTo = '';
    const storage: Storage = {
      get length() {
        return values.size;
      },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => {
        values.delete(key);
      },
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };

    Function('window', fallbackScript)({
      location: {
        pathname: `${basePath.slice(0, -1)}${pathname}`,
        search: '',
        hash: '',
        replace: (url: string) => {
          redirectedTo = url;
        },
      },
      sessionStorage: storage,
    });

    expect(redirectedTo).toBe(basePath);
    window.history.replaceState(null, '', basePath);

    let view: RenderResult | undefined;
    const router = bootstrapApp({
      source: { history: window.history, sessionStorage: storage },
      baseUrl: basePath,
      render: (createdRouter) => {
        view = render(<RouterProvider router={createdRouter} />);
      },
    });

    try {
      expect(
        await screen.findByRole('heading', { level: 1, name: heading }),
      ).toBeVisible();
      expect(window.location.pathname).toBe(`${basePath.slice(0, -1)}${pathname}`);
    } finally {
      view?.unmount();
      router.dispose();
    }
  });

  it('keeps the production entry point behind the tested bootstrap boundary', () => {
    const mainSource = readFileSync(resolve('src/main.tsx'), 'utf8');

    expect(mainSource).toMatch(
      /import\s+\{\s*bootstrapApp\s*\}\s+from\s+['"]\.\/app\/bootstrap['"]/,
    );
    expect(mainSource).toMatch(/bootstrapApp\s*\(/);
    expect(mainSource).not.toMatch(/\bcreateAppRouter\b/);
    expect(mainSource).not.toMatch(/\brestorePagesRoute\b/);
  });
});
