import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chat',
      testMatch: 'chat.spec.js',
      use: { baseURL: 'http://127.0.0.1:5173' },
    },
    {
      name: 'deadlines',
      testMatch: 'deadlines.spec.js',
      use: {
        baseURL: 'http://127.0.0.1:5173',
        timezoneId: 'America/Los_Angeles',
      },
    },
    {
      name: 'demo',
      testMatch: 'demo.spec.js',
      use: { baseURL: 'http://127.0.0.1:5174' },
    },
    {
      name: 'production',
      testMatch: 'production.spec.js',
      use: { baseURL: 'http://127.0.0.1:5175' },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1 --strictPort',
      url: 'http://127.0.0.1:5173',
      env: { VITE_USE_MOCK_CHAT: 'false' },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      env: { VITE_USE_MOCK_CHAT: 'true' },
    },
    // Deliberately build with the flag set: the production guard must still win.
    {
      command:
        'npm run build && npm run preview -- --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175',
      env: { VITE_USE_MOCK_CHAT: 'true' },
    },
  ],
})
