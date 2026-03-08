import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for browser UI tests.
 * Server must be running at http://localhost:8080 (or host.docker.internal:8080 in Docker).
 * Start with: npx serve public -l 8080
 */

const BASE_URL = process.env.PW_BASE_URL || 'http://localhost:8080';

export default defineConfig({
  testDir: './test/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
