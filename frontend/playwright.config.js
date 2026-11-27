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
      name: 'feedback',
      testMatch: 'feedback.spec.js',
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
      name: 'v2-shell',
      testMatch: 'v2-shell.spec.js',
      use: { baseURL: 'http://127.0.0.1:5176', timezoneId: 'Asia/Almaty' },
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
      env: { VITE_APP_MODE: 'legacy', VITE_RELEASE_MODE: '', VITE_USE_MOCK_CHAT: 'false' },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      env: { VITE_USE_MOCK_CHAT: 'true' },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5176 --strictPort',
      url: 'http://127.0.0.1:5176',
      env: { VITE_APP_MODE: 'public-demo', VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5177 --strictPort',
      url: 'http://127.0.0.1:5177',
      // Reserved local fixture configuration. All API and broker responses are intercepted.
      env: {
        VITE_APP_MODE: 'workspace', VITE_SUPABASE_URL: 'http://127.0.0.1:5177',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_browser_test_fixture',
        VITE_API_BASE_URL: '',
      },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5178 --strictPort',
      url: 'http://127.0.0.1:5178',
      env: {
        VITE_RELEASE_MODE: 'synthetic', VITE_APP_MODE: 'legacy',
        VITE_SUPABASE_URL: 'http://127.0.0.1:5178',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_browser_test_fixture',
      },
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
