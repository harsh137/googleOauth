// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Reporter for test results */
  reporter: [['html']],

  use: {
    headless: false, // Ensures browser opens
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // Captures screenshot when a test fails
    video: 'retain-on-failure', // Saves a video only if the test fails\
    slowMo: 4000, // Adds a delay to each step to see what's happening
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
    name:'Google Chrome',
    use:{...devices["Desktop Chrome"], channel: 'chrome' },
    },
  ],

  /* Auto-start local dev server before tests */
  webServer: {
    command: 'npm run dev', // Change if using a different command
    url: 'http://localhost:5173', // Change if using a different port
    reuseExistingServer: !process.env.CI,
  },
});
