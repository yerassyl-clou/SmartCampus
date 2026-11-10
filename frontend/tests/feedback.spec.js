import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const answer = {
  answer: 'The sample assignment is due on November 6.',
  grounded: true,
  sources: [
    { id: 1, title: 'Database Systems syllabus', excerpt: 'Assignment 2 is due on 6 November.' },
    { id: -1, title: 'Course deadlines', excerpt: 'Assignment 2' },
    { id: 0, title: 'Source without a valid ID' },
  ],
}
const saved = { status: 201, json: { id: 1, status: 'saved' } }
const uuidV4 = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i

async function boot(page, reply = answer) {
  await page.route('**/api/chat', route => route.fulfill({ json: reply }))
  await page.route('**/api/deadlines', route => route.fulfill({ json: { items: [], total: 0 } }))
  await page.goto('/')
  return ask(page)
}

async function ask(page) {
  await page.getByRole('textbox', { name: 'Your question' }).fill('When is Assignment 2 due?')
  await page.getByRole('button', { name: 'Send question' }).click()
  return page.getByRole('article', { name: 'SmartCampus response' }).last()
    .getByRole('region', { name: 'Answer feedback' })
}

test('helpful submits once, retains signed IDs and announces confirmed success', async ({ page }) => {
  const calls = []
  let release
  const gate = new Promise(resolve => { release = resolve })
  await page.route('**/api/feedback', async route => {
    calls.push(route.request().postDataJSON())
    await gate
    await route.fulfill(saved)
  })
  const widget = await boot(page)
  await expect(page.getByRole('article', { name: 'Your question' }).getByText('Was this answer helpful?')).toHaveCount(0)
  await widget.getByRole('button', { name: 'Helpful', exact: true }).click()
  await expect(widget.getByRole('status')).toHaveText('Sending feedback…')
  await expect(widget.getByRole('button', { name: 'Not helpful' })).toBeDisabled()
  await expect(widget.getByRole('button', { name: 'Helpful', exact: true })).toBeDisabled()
  release()
  await expect(widget.getByRole('status')).toHaveText('Feedback saved. Thank you.')
  await expect(widget.getByRole('button', { name: 'Helpful', exact: true })).toBeDisabled()
  expect(calls).toEqual([{ response_id: expect.stringMatching(uuidV4), rating: 'helpful', source_ids: [1, -1] }])
})

for (const comment of ['', 'Please check the sample deadline.']) {
  test('negative feedback with ' + (comment ? 'plain-text comment' : 'no comment'), async ({ page }) => {
    let payload
    await page.route('**/api/feedback', route => {
      payload = route.request().postDataJSON()
      return route.fulfill(saved)
    })
    const widget = await boot(page)
    await widget.getByRole('button', { name: 'Not helpful' }).click()
    await expect(widget.getByLabel('Issue category')).toBeFocused()
    await widget.getByRole('button', { name: 'Send feedback' }).click()
    expect(payload).toBeUndefined()
    await widget.getByLabel('Issue category').selectOption('outdated_information')
    await widget.getByLabel('Comment (optional)').fill(comment)
    await widget.getByRole('button', { name: 'Send feedback' }).click()
    await expect(widget.getByRole('status')).toContainText('Feedback saved')
    expect(payload).toMatchObject({ rating: 'not_helpful', issue_type: 'outdated_information', comment: comment || null })
  })
}

test('501 Unicode code points are rejected and 500 are accepted', async ({ page }) => {
  let count = 0
  await page.route('**/api/feedback', route => { count++; return route.fulfill(saved) })
  const widget = await boot(page)
  await widget.getByRole('button', { name: 'Not helpful' }).click()
  await widget.getByLabel('Issue category').selectOption('other')
  const text = widget.getByLabel('Comment (optional)')
  await text.fill('🙂'.repeat(501))
  await expect(widget.getByRole('alert')).toHaveText('Use 500 characters or fewer.')
  await expect(widget.getByRole('button', { name: 'Send feedback' })).toBeDisabled()
  expect(count).toBe(0)
  await text.fill('🙂'.repeat(500))
  await widget.getByRole('button', { name: 'Send feedback' }).click()
  await expect(widget.getByRole('status')).toContainText('Feedback saved')
  expect(count).toBe(1)
})

for (const mode of ['503', '422', 'network', 'invalid 201', 'duplicate']) {
  test(mode + ' preserves one UUID on retry and reports the outcome', async ({ page }) => {
    const calls = []
    await page.route('**/api/feedback', route => {
      calls.push(route.request().postDataJSON())
      if (calls.length === 2) return route.fulfill(mode === 'duplicate' ? { status: 409, json: {} } : saved)
      if (mode === 'network' || mode === 'duplicate') return route.abort('connectionreset')
      if (mode === 'invalid 201') return route.fulfill({ status: 201, json: { status: 'wrong' } })
      return route.fulfill({ status: Number(mode), json: { detail: 'private-debug-information' } })
    })
    const widget = await boot(page)
    await widget.getByRole('button', { name: 'Not helpful' }).click()
    await widget.getByLabel('Issue category').selectOption('incorrect_information')
    await widget.getByLabel('Comment (optional)').fill('Fictional correction')
    await widget.getByRole('button', { name: 'Send feedback' }).click()
    await expect(widget.getByRole('alert')).toBeVisible()
    await expect(widget).not.toContainText('private-debug-information')
    await expect(widget.getByLabel('Comment (optional)')).toHaveValue('Fictional correction')
    await expect(widget.getByLabel('Issue category')).toHaveValue('incorrect_information')
    await widget.getByRole('button', { name: 'Send feedback' }).click()
    await expect(widget.getByRole('status')).toContainText(mode === 'duplicate' ? 'already submitted' : 'Feedback saved')
    expect(calls).toHaveLength(2)
    expect(calls[1]).toEqual(calls[0])
    await expect(widget.getByRole('button', { name: 'Helpful', exact: true })).toBeDisabled()
  })
}

test('separate answers have independent feedback and safe fallback can be rated', async ({ page }) => {
  const calls = []
  await page.route('**/api/feedback', route => { calls.push(route.request().postDataJSON()); return route.fulfill(saved) })
  const first = await boot(page, { answer: 'No supporting course evidence was found.', grounded: false, sources: [] })
  await first.getByRole('button', { name: 'Helpful', exact: true }).click()
  await expect(first.getByRole('status')).toContainText('Feedback saved')
  const second = await ask(page)
  await expect(second.getByRole('button', { name: 'Helpful', exact: true })).toBeEnabled()
  await second.getByRole('button', { name: 'Helpful', exact: true }).click()
  await expect(second.getByRole('status')).toContainText('Feedback saved')
  expect(calls.map(call => call.source_ids)).toEqual([[], []])
  expect(calls[1].response_id).not.toBe(calls[0].response_id)
})

for (const [width, height] of [[375, 812], [768, 1024], [1440, 900]]) {
  test('form keyboard and layout at ' + width + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height })
    const widget = await boot(page)
    const opener = widget.getByRole('button', { name: 'Not helpful' })
    await opener.focus()
    await page.keyboard.press('Enter')
    await expect(widget.getByLabel('Issue category')).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(widget.getByLabel('Comment (optional)')).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (process.env.FEEDBACK_EVIDENCE) {
      await mkdir(process.env.FEEDBACK_EVIDENCE, { recursive: true })
      await widget.screenshot({ path: process.env.FEEDBACK_EVIDENCE + '/danaya-feedback-' + width + '.png' })
      if (width === 1440) {
        const article = page.getByRole('article', { name: 'SmartCampus response' })
        await article.screenshot({ path: process.env.FEEDBACK_EVIDENCE + '/danaya-feedback-answer.png' })
      }
    }
    await widget.getByRole('button', { name: 'Cancel' }).click()
    await expect(opener).toBeFocused()
    await expect(widget.getByLabel('Issue category')).toHaveCount(0)
  })
}
