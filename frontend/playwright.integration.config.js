import { defineConfig } from '@playwright/test'

if (process.env.SMARTCAMPUS_LIVE_TESTS !== '1') {
  throw new Error('Live Groq tests require explicit SMARTCAMPUS_LIVE_TESTS=1 and backend/.env configuration.')
}

export default defineConfig({
  testDir: './tests',
  testMatch: 'integration.spec.js',
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: 'list',
  use: { browserName: 'chromium', baseURL: 'http://localhost:5173',
    viewport: { width: 1440, height: 1000 }, trace: 'off' },
  webServer: [
    { command: 'python -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8000',
      url: 'http://127.0.0.1:8000/api/health' },
    // A real FastAPI instance with an unreachable provider. No live key used.
    { command: 'python -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8001',
      url: 'http://127.0.0.1:8001/api/health',
      env: { OPENAI_API_KEY: 'test-only', OPENAI_MODEL: 'test-model',
        OPENAI_BASE_URL: 'http://127.0.0.1:9/v1' } },
    { command: 'npm run dev -- --host 127.0.0.1 --strictPort', url: 'http://localhost:5173',
      env: { VITE_USE_MOCK_CHAT: 'false' } },
  ],
})
