import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: 'line',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:43179',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `"${process.execPath}" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 43179 --strictPort`,
    url: 'http://127.0.0.1:43179',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'iphone-13',
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
