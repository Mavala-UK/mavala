import {defineConfig, devices} from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10000,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-mobile',
      testDir: './e2e',
      use: {
        ...devices['iPhone SE'],
        viewport: {width: 375, height: 667},
      },
    },
    {
      name: 'chromium-tablet',
      testDir: './e2e',
      use: {
        ...devices['iPad Mini'],
        viewport: {width: 768, height: 1024},
      },
    },
    {
      name: 'chromium-desktop',
      testDir: './e2e',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {width: 1440, height: 900},
      },
    },
    {
      name: 'chromium-wide',
      testDir: './e2e',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {width: 2560, height: 1440},
      },
    },
  ],
});
