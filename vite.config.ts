// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { readFile, writeFile } from 'node:fs/promises';
// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin, ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fallbackBasePlaceholder = '__VITE_BASE_PATH__';

function pagesFallbackBasePlugin(): Plugin {
  let resolvedConfig: ResolvedConfig;

  return {
    name: 'pages-fallback-base',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config;
    },
    async closeBundle() {
      const fallbackPath = resolve(
        resolvedConfig.root,
        resolvedConfig.build.outDir,
        '404.html',
      );
      const fallback = await readFile(fallbackPath, 'utf8');
      const quotedPlaceholder = JSON.stringify(fallbackBasePlaceholder);

      if (!fallback.includes(quotedPlaceholder)) {
        throw new Error(`Pages fallback placeholder missing from ${fallbackPath}`);
      }

      await writeFile(
        fallbackPath,
        fallback.replace(quotedPlaceholder, JSON.stringify(resolvedConfig.base)),
        'utf8',
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), pagesFallbackBasePlugin()],
    test: {
      include: ['src/**/*.test.{ts,tsx}', 'tests/build/**/*.spec.ts'],
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      globals: true,
    },
  };
});
