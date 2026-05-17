import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.{spec,test}.ts', '**/*.{spec,test}.tsx', '**/*.pl.tsx'],
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI
  }
});
