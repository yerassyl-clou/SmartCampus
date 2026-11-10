import { test, expect } from '@playwright/test'

const cases = [
  ['TC-01', 'When is Assignment 2 due?', '2026-11-06', 'Mock Database Systems syllabus', 1],
  ['TC-02', 'What should I submit for Assignment 2?', 'normalized schema and query plan', 'Mock Database Systems syllabus', 1],
  ['TC-03', 'What is the rule for late database lab work?', 'three calendar days with a short explanation', 'Mock Database Systems course rules', 2],
  ['TC-04', 'When is the risk register review due?', '2026-11-09', 'Mock Software Project Management syllabus', 3],
  ['TC-05', 'What must the risk register include?', 'an owner for each identified risk', 'Mock Software Project Management syllabus', 3],
  ['TC-06', 'When is the usability test plan due?', '2026-11-11', 'Mock Human-Computer Interaction syllabus', 5],
  ['TC-07', 'What should the usability test plan describe?', 'participants, tasks, and success measures', 'Mock Human-Computer Interaction syllabus', 5],
]

for (const [id, question, fact, title, sourceId] of cases) {
  test(`${id} REAL Groq: ${question}`, async ({ page }, testInfo) => {
    await page.goto('/')
    await expect(page.locator('.deadline-card')).toHaveCount(6)
    await expect(page.getByText('Demo data · Mock mode')).toHaveCount(0)
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/chat'))
    await page.getByRole('textbox', { name: 'Your question' }).fill(question)
    await page.getByRole('textbox').press('Enter')
    const response = await responsePromise
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.grounded).toBe(true)
    expect(data.answer).toContain(fact)
    expect(data.sources.some(s => s.id === sourceId && s.title === title)).toBe(true)
    // Every returned quote is checked against retrieved SQLite excerpts by FastAPI.
    await expect(page.getByRole('article', { name: 'SmartCampus response' })).toContainText(fact)
    await expect(page.locator('.source-card')).not.toHaveCount(0)
    await testInfo.attach(`${id}-real-provider-response`, { body: JSON.stringify(data, null, 2), contentType: 'application/json' })
    if (id === 'TC-02' || id === 'TC-03') {
      await page.screenshot({ path: testInfo.outputPath(`${id}-real-groq.png`), fullPage: true })
    }
  })
}

test('TC-08/09/10/12 real SQLite, deadline navigation/refresh, fallback, responsive UI', async ({ page, request }, testInfo) => {
  const health = await request.get('http://localhost:8000/api/health')
  expect(await health.json()).toEqual({ status: 'ok', app: 'SmartCampus' })
  const deadlines = await request.get('http://localhost:8000/api/deadlines')
  const records = (await deadlines.json()).items
  expect(records).toHaveLength(6)
  expect((await (await request.get('http://localhost:8000/api/deadlines?course_id=1')).json()).total).toBe(2)
  expect((await (await request.get('http://localhost:8000/api/deadlines?course_id=999')).json()).total).toBe(0)
  const general = await request.post('http://localhost:8000/api/chat', { data: { question: 'Show all deadlines' } })
  expect((await general.json()).sources).toHaveLength(6)
  await page.goto('/')
  await expect(page.locator('.deadline-card')).toHaveCount(6)
  for (const [question, fact] of [
    ['What deadlines do I have?', 'Fictional sample course deadlines'],
    ["What is the rector's personal phone number?", "I couldn't find this information"],
    ['When is the Physics exam?', "I couldn't find this information"],
  ]) {
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/chat'))
    await page.getByRole('textbox').fill(question)
    await page.getByRole('button', { name: 'Send question' }).click()
    const response = await responsePromise
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.answer).toContain(fact)
    expect(data.grounded).toBe(question.startsWith('What deadlines'))
    await expect(page.getByRole('article', { name: 'SmartCampus response' }).last()).toContainText(fact)
  }
  await page.getByRole('link', { name: 'Course deadlines', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Course deadlines', exact: true })).toBeInViewport()
  await page.getByRole('button', { name: 'Refresh deadlines' }).click()
  await expect(page.locator('.deadline-card')).toHaveCount(6)
  await expect(page.locator('.deadline-card time')).toHaveText(['Nov 6, 2026','Nov 9, 2026','Nov 11, 2026','Nov 13, 2026','Nov 20, 2026','Nov 27, 2026'])
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 1000 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`real-sqlite-${width}.png`), fullPage: true })
  }
  await expect(page.getByRole('article', { name: 'SmartCampus response' })).toHaveCount(3)
})

test('TC-11 actual provider connection failure, safe error, Retry, continued use', async ({ page, request }) => {
  const response = await request.post('http://localhost:8001/api/chat', { data: { question: 'Assignment 2' } })
  expect(response.status()).toBe(503)
  expect(response.headers()['x-smartcampus-error']).toBe('unavailable')
  // Redirect only transport to the real failure backend; no fabricated response.
  await page.route('**/api/chat', route => route.continue({ url: 'http://127.0.0.1:8001/api/chat' }))
  await page.goto('/')
  await page.getByRole('textbox').fill('When is Assignment 2 due?')
  await page.getByRole('textbox').press('Enter')
  await expect(page.getByRole('alert')).toContainText('The AI service is temporarily unavailable.')
  await expect(page.getByRole('article', { name: 'SmartCampus response' })).toHaveCount(0)
  await page.unroute('**/api/chat')
  // Recovery exercises the same Retry through the normal FastAPI backend.
  // It is one additional, explicitly real provider request.
  await page.getByRole('button', { name: 'Retry question' }).click()
  await expect(page.getByRole('article', { name: 'SmartCampus response' })).toContainText('2026-11-06', { timeout: 30000 })
  await expect(page.getByRole('article', { name: 'Your question' })).toHaveCount(1)
  await expect(page.getByRole('alert')).toHaveCount(0)
})
