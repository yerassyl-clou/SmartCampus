import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { writeFile } from 'node:fs/promises'

const { chromium } = createRequire(process.cwd() + '/package.json')('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const output = process.env.FEEDBACK_OUTPUT
const isPost = response => response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/feedback'

try {
  // Only Chat is intercepted. The feedback POSTs and deadline reads use FastAPI.
  await page.route('**/api/chat', route => route.fulfill({ json: {
    answer: 'Assignment 2 is due on 6 November in the fictional dataset.',
    grounded: true,
    sources: [{ id: 1, title: 'Database Systems syllabus', excerpt: 'Assignment 2' },
      { id: -1, title: 'Course deadlines', excerpt: '6 November' }],
  } }))
  const deadline = page.waitForResponse(response => response.url().endsWith('/api/deadlines'))
  await page.goto('http://127.0.0.1:5187')
  assert.equal((await deadline).status(), 200)
  async function ask() {
    const answers = page.getByRole('article', { name: 'SmartCampus response' })
    const previous = await answers.count()
    const question = page.getByRole('textbox', { name: 'Your question' })
    await question.fill('When is Assignment 2 due?')
    await question.press('Enter')
    await answers.nth(previous).waitFor({ timeout: 10000 })
    return answers.nth(previous)
  }

  const first = await ask()
  const helpful = page.waitForResponse(isPost)
  await first.getByRole('button', { name: 'Helpful', exact: true }).click()
  const positive = await helpful
  assert.equal(positive.status(), 201)
  assert.equal((await positive.json()).status, 'saved')
  await first.getByText('Feedback saved. Thank you.').waitFor()
  assert.ok(await first.getByRole('button', { name: 'Helpful', exact: true }).isDisabled())
  await first.locator('.message-content').screenshot({ path: output + '/danaya-feedback-saved.png' })

  const second = await ask()
  await second.getByRole('button', { name: 'Not helpful' }).click()
  await second.getByLabel('Issue category').selectOption('outdated_information')
  await second.getByLabel('Comment (optional)').fill('Please check the fictional deadline.')
  const reported = page.waitForResponse(isPost)
  await second.getByRole('button', { name: 'Send feedback' }).click()
  const negative = await reported
  assert.equal(negative.status(), 201)
  assert.equal((await negative.json()).status, 'saved')
  await second.getByText('Feedback saved. Thank you.').waitFor()

  const payloads = [positive, negative].map(response => response.request().postDataJSON())
  assert.deepEqual(payloads.map(payload => payload.source_ids), [[1, -1], [1, -1]])
  assert.notEqual(payloads[0].response_id, payloads[1].response_id)
  await writeFile(output + '/feedback-payloads.local.json', JSON.stringify(payloads))
  console.log('Chromium ' + browser.version() + ': two real POSTs returned 201; saved state shown; distinct UUIDs and signed source IDs.')
  console.log('Chat used a fictional fixture. GET deadlines and both POST feedback calls were live.')
} finally {
  await browser.close()
}
