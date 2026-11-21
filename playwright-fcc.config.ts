import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'fcc-onboarding-dev.spec.ts',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  // No webServer - use existing dev server on port 3100
  outputDir: './test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: './playwright-report' }]],
});