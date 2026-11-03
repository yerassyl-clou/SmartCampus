import { test, expect } from '@playwright/test'

// Controlled browser fixtures only. Production records always come from FastAPI.
const records = [
  { id: 1, course_id: 1, course_name: 'Database Systems', title: 'Assignment 2', due_date: '2026-11-06', source_title: 'Mock Database Systems syllabus' },
  { id: 2, course_id: 1, course_name: 'Database Systems', title: 'Midterm project proposal', due_date: '2026-11-06', source_title: 'Mock Database Systems syllabus' },
  { id: 3, course_id: 2, course_name: 'Software Project Management', title: 'Risk register review', due_date: '2026-11-09', source_title: 'Mock Software Project Management syllabus' },
  { id: 4, course_id: 2, course_name: 'Software Project Management', title: 'Sprint review presentation', due_date: '2026-11-20', source_title: 'Mock Software Project Management syllabus' },
  { id: 5, course_id: 3, course_name: 'Human-Computer Interaction', title: 'Usability test plan', due_date: '2026-11-11', source_title: 'Mock Human-Computer Interaction syllabus' },
  { id: 6, course_id: 3, course_name: 'Human-Computer Interaction', title: 'Prototype critique', due_date: '2026-11-27', source_title: 'Mock Human-Computer Interaction syllabus' },
]
const shuffled = [records[5], records[3], records[1], records[4], records[2], records[0]]
const response = { items: shuffled, total: 6 }
const panel = (page) => page.getByRole('region', { name: 'Upcoming deadlines', exact: true })
const cards = (page) => panel(page).getByRole('listitem')

async function serve(page, data = response) {
  await page.route('**/api/deadlines', (route) => route.fulfill({ json: data }))
  await page.goto('/')
}

test('GET renders all six server records, sorts dates and breaks equal-date ties by ID', async ({ page }) => {
  const methods = []
  await page.route('**/api/deadlines', (route) => {
    methods.push(route.request().method())
    return route.fulfill({ json: response })
  })
  await page.goto('/')
  await expect(cards(page)).toHaveCount(6)
  expect(methods.length).toBeGreaterThan(0)
  expect(methods.every((method) => method === 'GET')).toBe(true)
  await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText([
    'Assignment 2', 'Midterm project proposal', 'Risk register review',
    'Usability test plan', 'Sprint review presentation', 'Prototype critique',
  ])
  for (const record of records) {
    const card = cards(page).filter({ has: page.getByRole('heading', { name: record.title, exact: true }) })
    await expect(card).toContainText(record.course_name)
    await expect(card).toContainText(record.source_title)
    await expect(card.locator('time')).toHaveAttribute('datetime', record.due_date)
  }
  // This project uses a negative UTC offset: a date-only value must not move back a day.
  await expect(cards(page).first().locator('time')).toHaveText('Nov 6, 2026')
})

test('pending request announces loading and prevents concurrent refresh', async ({ page }) => {
  let release
  const gate = new Promise((resolve) => { release = resolve })
  await page.route('**/api/deadlines', async (route) => {
    await gate
    await route.fulfill({ json: response })
  })
  await page.goto('/')
  await expect(panel(page).getByRole('status')).toContainText('Loading deadlines')
  await expect(panel(page).getByRole('button', { name: 'Refresh deadlines' })).toBeDisabled()
  release()
  await expect(cards(page)).toHaveCount(6)
  await expect(panel(page).getByRole('status')).toHaveCount(0)
  await expect(panel(page).getByRole('button', { name: 'Refresh deadlines' })).toBeEnabled()
})

test('empty API response shows useful state and can be refreshed', async ({ page }) => {
  await serve(page, { items: [], total: 0 })
  await expect(panel(page).getByRole('heading', { name: 'No deadlines to show' })).toBeVisible()
  await expect(cards(page)).toHaveCount(0)
  await expect(panel(page).getByRole('button', { name: 'Refresh deadlines' })).toBeEnabled()
})

for (const [kind, message] of [
  ['http', 'The deadline service is temporarily unavailable.'],
  ['network', 'The deadline service could not be reached.'],
  ['json', 'The server returned unreadable deadline data.'],
]) {
  test(`${kind} failure has a readable error and a working Retry`, async ({ page }) => {
    let fail = true
    await page.route('**/api/deadlines', (route) => {
      if (!fail) return route.fulfill({ json: response })
      if (kind === 'network') return route.abort('connectionrefused')
      if (kind === 'http') return route.fulfill({ status: 503, json: { detail: 'private-debug-information' } })
      return route.fulfill({ contentType: 'application/json', body: '<html>not JSON</html>' })
    })
    await page.goto('/')
    await expect(panel(page).getByRole('alert')).toContainText(message)
    await expect(panel(page)).not.toContainText('private-debug-information')
    await expect(cards(page)).toHaveCount(0)
    fail = false
    await panel(page).getByRole('button', { name: 'Retry deadlines' }).click()
    await expect(cards(page)).toHaveCount(6)
    await expect(panel(page).getByRole('alert')).toHaveCount(0)
  })
}

for (const [label, bad] of [
  ['missing items', { total: 0 }],
  ['mismatched total', { items: [records[0]], total: 6 }],
  ['invalid calendar date', { items: [{ ...records[0], due_date: '2026-02-30' }], total: 1 }],
  ['empty required field', { items: [{ ...records[0], source_title: ' ' }], total: 1 }],
  ['duplicate IDs', { items: [records[0], records[0]], total: 2 }],
  ['invalid record ID', { items: [{ ...records[0], id: 0 }], total: 1 }],
  ['invalid course ID', { items: [{ ...records[0], course_id: '1' }], total: 1 }],
]) {
  test(`rejects malformed contract: ${label}`, async ({ page }) => {
    await serve(page, bad)
    await expect(panel(page).getByRole('alert')).toContainText('The server returned unexpected deadline data.')
    await expect(cards(page)).toHaveCount(0)
    await expect(panel(page).getByRole('button', { name: 'Retry deadlines' })).toBeEnabled()
  })
}

test('Refresh and page reload fetch updated server data', async ({ page }) => {
  let current = { items: [records[0]], total: 1 }
  let requests = 0
  await page.route('**/api/deadlines', (route) => {
    requests++
    return route.fulfill({ json: current })
  })
  await page.goto('/')
  await expect(cards(page)).toHaveCount(1)
  const initialRequests = requests
  current = { items: [{ ...records[0], title: 'Updated by server', due_date: '2026-12-01' }], total: 1 }
  await panel(page).getByRole('button', { name: 'Refresh deadlines' }).click()
  await expect(panel(page).getByRole('heading', { name: 'Updated by server' })).toBeVisible()
  expect(requests).toBeGreaterThan(initialRequests)
  await expect(cards(page).locator('time')).toHaveAttribute('datetime', '2026-12-01')
  current = { items: [{ ...records[1], title: 'Loaded after page reload' }], total: 1 }
  await page.reload()
  await expect(panel(page).getByRole('heading', { name: 'Loaded after page reload' })).toBeVisible()
  await expect(panel(page).getByRole('heading', { name: 'Updated by server' })).toHaveCount(0)
})

test('failed refresh keeps prior records with an explicit stale-data notice, then Retry recovers', async ({ page }) => {
  let fail = false
  await page.route('**/api/deadlines', (route) => fail
    ? route.fulfill({ status: 500, json: { detail: 'service failed' } })
    : route.fulfill({ json: response }))
  await page.goto('/')
  await expect(cards(page)).toHaveCount(6)
  fail = true
  await panel(page).getByRole('button', { name: 'Refresh deadlines' }).click()
  await expect(panel(page).getByRole('alert')).toBeVisible()
  await expect(cards(page)).toHaveCount(6)
  await expect(panel(page)).toContainText('Showing the last loaded deadlines. Refresh to check for changes.')
  fail = false
  await panel(page).getByRole('button', { name: 'Retry deadlines' }).click()
  await expect(panel(page).getByRole('alert')).toHaveCount(0)
  await expect(panel(page)).not.toContainText('Showing the last loaded deadlines.')
})

test('timeout is recoverable and Retry starts a fresh request', async ({ page }) => {
  await page.clock.install()
  await page.route('**/api/deadlines', () => {})
  await page.goto('/')
  await expect(panel(page).getByRole('status')).toContainText('Loading deadlines')
  await page.clock.fastForward(16000)
  await expect(panel(page).getByRole('alert')).toContainText('Loading deadlines took too long.')
  await page.unroute('**/api/deadlines')
  await page.route('**/api/deadlines', (route) => route.fulfill({ json: response }))
  await panel(page).getByRole('button', { name: 'Retry deadlines' }).click()
  await expect(cards(page)).toHaveCount(6)
})

test('API markup is rendered as text rather than executable content', async ({ page }) => {
  const markup = '<img src=x onerror="window.deadlineInjected=true">'
  await serve(page, { items: [{ ...records[0], title: markup, source_title: markup }], total: 1 })
  await expect(cards(page)).toHaveCount(1)
  await expect(cards(page).getByRole('heading')).toHaveText(markup)
  await expect(cards(page).locator('img')).toHaveCount(0)
  expect(await page.evaluate(() => window.deadlineInjected)).toBeUndefined()
})

for (const [width, height] of [[1440, 900], [768, 1024], [375, 812]]) {
  test(`deadline layout at ${width}px wraps long records without horizontal overflow`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height })
    const long = 'X'.repeat(180)
    await serve(page, { items: [{ ...records[0], title: long, course_name: long, source_title: long }, ...records.slice(1)], total: 6 })
    await expect(cards(page)).toHaveCount(6)
    await panel(page).scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await panel(page).evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
    await expect(panel(page).getByRole('button', { name: 'Refresh deadlines' })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(`deadlines-${width}.png`), fullPage: true })
  })
}
