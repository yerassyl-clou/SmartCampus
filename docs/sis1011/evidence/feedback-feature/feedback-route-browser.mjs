import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const { chromium } = createRequire(process.cwd() + '/package.json')('playwright')
const out = '../docs/sis1011/evidence/feedback-feature'
const answer = {
  answer: 'The sample assignment is due on November 6.',
  grounded: true,
  sources: [
    { id: 1, title: 'Database Systems syllabus', excerpt: 'Assignment 2 is due on 6 November.' },
    { id: -1, title: 'Course deadlines', excerpt: 'Assignment 2' },
    { id: 0, title: 'Source without a valid ID' },
  ],
}
const browser = await chromium.launch()
console.log('Chromium', browser.version(), new Date().toISOString())
async function openChat(url) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.route('**/api/chat', route => route.fulfill({ json: answer }))
  await page.goto(url)
  await page.getByRole('textbox', { name: 'Your question' }).fill('When is Assignment 2 due?')
  await page.getByRole('button', { name: 'Send question' }).click()
  return { page, article: page.getByRole('article', { name: 'SmartCampus response' }) }
}

try {
  const baseline = await openChat(process.env.BASELINE_URL ?? 'http://127.0.0.1:5183')
  await baseline.article.waitFor()
  assert.equal(await baseline.article.getByRole('button', { name: 'Helpful', exact: true }).count(), 0)
  await baseline.article.locator('.message-content').screenshot({ path: out + '/danaya-feedback-before.png' })
  await baseline.page.close()

  const { page, article } = await openChat(process.env.FEEDBACK_URL ?? 'http://127.0.0.1:5185')
  await article.getByRole('button', { name: 'Helpful', exact: true }).waitFor()
  await article.locator('.message-content').screenshot({ path: out + '/danaya-feedback-answer.png' })
  const post = () => page.waitForResponse(res => res.url().endsWith('/api/feedback'))
  const request = post()
  await article.getByRole('button', { name: 'Helpful', exact: true }).click()
  const first = await request
  assert.equal(first.status(), 503)
  assert.equal(first.headers()['x-smartcampus-error'], 'feedback_unavailable')
  const payload = first.request().postDataJSON()
  assert.deepEqual(payload.source_ids, [1, -1])
  assert.match(payload.response_id, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
  const alert = article.getByRole('alert')
  await alert.waitFor()
  assert.match(await alert.innerText(), /storage is temporarily unavailable/)
  const retry = post()
  await article.getByRole('button', { name: 'Retry feedback' }).click()
  const second = await retry
  assert.equal(second.status(), 503)
  assert.deepEqual(second.request().postDataJSON(), payload)
  await alert.waitFor()
  assert.equal(await article.getByText('Feedback saved. Thank you.').count(), 0)
  await article.locator('.message-content').screenshot({ path: out + '/danaya-feedback-route-503.png' })
  console.log('PASS: real POST through Vite proxy to FastAPI PR #16 returned 503 feedback_unavailable twice, preserved UUID and signed IDs, showed Retry without a saved state.')
  console.log('Chat response was a browser fixture. The feedback POST was not intercepted. Production SQLite persistence was unavailable and was not tested.')
} finally {
  await browser.close()
}
