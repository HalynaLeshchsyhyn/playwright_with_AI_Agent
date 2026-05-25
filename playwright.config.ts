import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['monocart-reporter', {
      name:   'TC-ECOM-003 Test Report',
      outputFile: './test-results/monocart/index.html',
    }],
  ],
  use: {
    baseURL: 'https://automationexercise.com',
    screenshot: 'only-on-failure',
    trace:      'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], headless: false },
    },
  ],
});
