import { test, expect } from '@playwright/test'

const grounded = {
  answer: 'Assignment 2 is due on 2026-11-06.',
  grounded: true,
  sources: [
    {
      id: 1,
      title: 'Mock Database Systems syllabus',
      excerpt: 'Assignment 2 deadline: 2026-11-06',
    },
    {
      id: 2,
      title: 'Mock submission guide',
      excerpt: 'Upload your coursework to the course portal.',
    },
  ],
}

async function ask(page, question = 'When is Assignment 2 due?') {
  await page.getByRole('textbox', { name: 'Your question' }).fill(question)
  await page.getByRole('button', { name: 'Send question' }).click()
}

test.beforeEach(async ({ page }) => {
  // Chat regressions do not depend on a running deadline backend.
  await page.route('**/api/deadlines', (route) =>
    route.fulfill({ json: { items: [], total: 0 } })
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'No deadlines to show' })).toBeVisible()
})

test('welcome suggestions populate and focus the input without requesting an answer', async ({
  page,
}) => {
  let calls = 0
  await page.route('**/api/chat', async (route) => {
    calls++
    await route.fulfill({ json: grounded })
  })
  await expect(page.getByText('Demo data · Mock mode')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Send question' })
  ).toBeDisabled()
  await page.getByRole('button', { name: /Stay ahead of deadlines/ }).click()
  await expect(page.getByRole('textbox')).toHaveValue(
    'When is my next Database Systems assignment due?'
  )
  await expect(page.getByRole('textbox')).toBeFocused()
  expect(calls).toBe(0)
  await page.getByRole('textbox').fill('   \n  ')
  await page.getByRole('textbox').press('Enter')
  await expect(
    page.getByRole('button', { name: 'Send question' })
  ).toBeDisabled()
  await expect(
    page.getByRole('article', { name: 'Your question' })
  ).toHaveCount(0)
  expect(calls).toBe(0)
})

test('sends the contract, trims questions, renders multiple sources and preserves history', async ({
  page,
}) => {
  const requests = []
  await page.route('**/api/chat', async (route) => {
    requests.push(route.request())
    await route.fulfill({ json: grounded })
  })
  await ask(page, '   When is Assignment 2 due?   ')
  const answer = page.getByRole('article', { name: 'SmartCampus response' })
  await expect(answer).toContainText(grounded.answer)
  expect(requests[0].method()).toBe('POST')
  expect(requests[0].headers()['content-type']).toBe('application/json')
  expect(requests[0].postDataJSON()).toEqual({
    question: 'When is Assignment 2 due?',
  })
  await expect(
    page.getByRole('article', { name: 'Your question' })
  ).toContainText('When is Assignment 2 due?')
  await expect(
    answer.getByRole('heading', { name: 'Mock Database Systems syllabus' })
  ).toBeVisible()
  await expect(
    answer.getByText('Assignment 2 deadline: 2026-11-06')
  ).toBeVisible()
  await expect(answer.locator('.source-card')).toHaveCount(2)
  await expect(answer.getByRole('link')).toHaveCount(0)
  await expect(page.getByRole('textbox')).toHaveValue('')
  await ask(page, 'What about the submission?')
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toHaveCount(2)
  await expect(
    page.getByRole('article', { name: 'Your question' })
  ).toHaveCount(2)
})

test('optional course ID is passed only when supplied by the caller', async ({
  page,
}) => {
  let payload
  await page.route('**/api/chat', async (route) => {
    payload = route.request().postDataJSON()
    await route.fulfill({ json: grounded })
  })
  await page.evaluate(async () => {
    const { requestChat } = await import('/src/lib/chat.js')
    await requestChat('Course question', { courseId: 7 })
  })
  expect(payload).toEqual({ question: 'Course question', course_id: 7 })
})

test('pending state blocks button, Enter and direct form resubmission while preserving drafts', async ({
  page,
}) => {
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  let calls = 0
  await page.route('**/api/chat', async (route) => {
    calls++
    await gate
    await route.fulfill({ json: grounded })
  })
  await ask(page)
  await expect(page.getByRole('status')).toContainText(
    'Looking through course information'
  )
  await expect(
    page.getByRole('button', { name: 'Send question' })
  ).toBeDisabled()
  await page.getByRole('textbox').fill('A draft for later')
  await page.getByRole('textbox').press('Enter')
  await page.locator('form').evaluate((form) => form.requestSubmit())
  expect(calls).toBe(1)
  await expect(
    page.getByRole('article', { name: 'Your question' })
  ).toHaveCount(1)
  release()
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toBeVisible()
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.getByRole('textbox')).toHaveValue('A draft for later')
  await expect(
    page.getByRole('button', { name: 'Send question' })
  ).toBeEnabled()
})

test('Enter sends, Shift+Enter adds a newline, and IME Enter does not submit', async ({
  page,
}) => {
  let body
  await page.route('**/api/chat', async (route) => {
    body = route.request().postDataJSON()
    await route.fulfill({ json: grounded })
  })
  const input = page.getByRole('textbox')
  await input.fill('First line')
  await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true })
  await expect(page.getByRole('article')).toHaveCount(0)
  await input.press('Shift+Enter')
  await input.pressSequentially('Second line')
  await expect(input).toHaveValue('First line\nSecond line')
  await input.press('Enter')
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toBeVisible()
  expect(body.question).toBe('First line\nSecond line')
})

test('no-evidence answer has a clear warning and no attribution, even with inconsistent sources', async ({
  page,
}) => {
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      json: {
        ...grounded,
        answer:
          "I couldn't find this information in the available course materials.",
        grounded: false,
      },
    })
  )
  await ask(page, 'Unknown information')
  await expect(
    page.getByText(
      "I couldn't find this information in the available course materials.",
      { exact: true }
    )
  ).toBeVisible()
  await expect(page.getByText(/This answer is not verified/)).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Response sources' })
  ).toHaveCount(0)
})

test('empty or omitted source arrays do not imply verified evidence', async ({
  page,
}) => {
  let count = 0
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      json:
        count++ === 0
          ? { answer: 'Answer without details.', grounded: true, sources: [] }
          : { answer: 'Another answer.', grounded: true },
    })
  )
  await ask(page)
  await expect(page.getByText(/No source details were returned/)).toBeVisible()
  await ask(page, 'A second question')
  await expect(page.getByText(/No source details were returned/)).toHaveCount(2)
  await expect(page.locator('.source-card')).toHaveCount(0)
})

test('partial source details are displayed safely without fabricating missing information', async ({
  page,
}) => {
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      json: {
        ...grounded,
        sources: [
          null,
          {},
          { title: 'Title only' },
          { excerpt: 'Excerpt only' },
          { title: 42, excerpt: false },
        ],
      },
    })
  )
  await ask(page)
  await expect(page.locator('.source-card')).toHaveCount(2)
  await expect(page.getByText('Title only', { exact: true })).toBeVisible()
  await expect(page.getByText('Excerpt only', { exact: true })).toBeVisible()
})

for (const [status, expected] of [
  [422, 'Your question could not be accepted.'],
  [503, 'The AI service is temporarily unavailable.'],
  [501, 'Chat is not available on the backend yet.'],
  [500, 'Something went wrong while sending your question.'],
]) {
  test(`HTTP ${status} preserves history, hides backend details and supports retry`, async ({
    page,
  }) => {
    let count = 0
    await page.route('**/api/chat', (route) => {
      count++
      return count === 2
        ? route.fulfill({ status, json: { detail: 'sensitive-debug-text' } })
        : route.fulfill({ json: grounded })
    })
    await ask(page, 'First question')
    await expect(
      page.getByRole('article', { name: 'SmartCampus response' })
    ).toHaveCount(1)
    await ask(page, 'Second question')
    await expect(page.getByRole('alert')).toContainText(expected)
    await expect(page.getByText('sensitive-debug-text')).toHaveCount(0)
    await expect(
      page.getByRole('article', { name: 'Your question' })
    ).toHaveCount(2)
    await expect(
      page.getByRole('article', { name: 'SmartCampus response' })
    ).toHaveCount(1)
    await page.getByRole('button', { name: 'Retry question' }).click()
    await expect(
      page.getByRole('article', { name: 'SmartCampus response' })
    ).toHaveCount(2)
    await expect(
      page.getByRole('article', { name: 'Your question' })
    ).toHaveCount(2)
    await expect(page.getByRole('alert')).toHaveCount(0)
    expect(count).toBe(3)
  })
}

test('network failure allows a new question without losing the failed one', async ({
  page,
}) => {
  await page.route('**/api/chat', (route) => route.abort('connectionrefused'))
  await ask(page)
  await expect(page.getByRole('alert')).toContainText(
    'The backend could not be reached.'
  )
  await page.unroute('**/api/chat')
  await page.route('**/api/chat', (route) => route.fulfill({ json: grounded }))
  await ask(page, 'Try a different question')
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toBeVisible()
  await expect(
    page.getByRole('article', { name: 'Your question' })
  ).toHaveCount(2)
  await expect(page.getByRole('alert')).toHaveCount(0)
})

for (const body of [
  null,
  {},
  { answer: ' ', grounded: true },
  { answer: 42, grounded: true },
  { answer: 'Missing grounding' },
  { answer: 'Wrong type', grounded: 'true' },
  { ...grounded, sources: {} },
]) {
  test(`rejects malformed payload ${JSON.stringify(body)}`, async ({
    page,
  }) => {
    await page.route('**/api/chat', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(body),
      })
    )
    await ask(page)
    await expect(page.getByRole('alert')).toContainText('unexpected response')
    await expect(
      page.getByRole('article', { name: 'SmartCampus response' })
    ).toHaveCount(0)
  })
}

test('unreadable JSON and timed-out requests have recoverable errors', async ({
  page,
}) => {
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html>proxy error</html>',
    })
  )
  await ask(page)
  await expect(page.getByRole('alert')).toContainText('unreadable response')
  await page.unroute('**/api/chat')
  await page.route('**/api/chat', () => {})
  await page.clock.install()
  await page.getByRole('button', { name: 'Retry question' }).click()
  await expect(page.getByRole('status')).toBeVisible()
  await page.clock.fastForward(31000)
  await expect(page.getByRole('alert')).toContainText(
    'The response took too long.'
  )
  await expect(
    page.getByRole('button', { name: 'Retry question' })
  ).toBeEnabled()
})

test('API-provided markup renders as text', async ({ page }) => {
  const markup = '<img src=x onerror="window.injected=true">'
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      json: {
        answer: markup,
        grounded: true,
        sources: [{ title: markup, excerpt: markup }],
      },
    })
  )
  await ask(page)
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toContainText(markup)
  await expect(page.locator('.message-bubble img')).toHaveCount(0)
  expect(await page.evaluate(() => window.injected)).toBeUndefined()
})

test('keyboard access, live announcements and focus indicators are available', async ({
  page,
}) => {
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to question input' })
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('textbox')).toBeFocused()
  await expect(page.getByRole('log')).toHaveAttribute('aria-live', 'polite')
  await expect(
    page.getByRole('region', { name: 'Conversation history' })
  ).toHaveAttribute('tabindex', '0')
  await page.getByRole('textbox').fill('Keyboard question')
  await page.keyboard.press('Tab')
  const send = page.getByRole('button', { name: 'Send question' })
  await expect(send).toBeFocused()
  expect(
    await send.evaluate((element) => getComputedStyle(element).outlineStyle)
  ).toBe('solid')
})

for (const [width, height] of [
  [1440, 900],
  [768, 1024],
  [375, 812],
]) {
  test(`layout at ${width}px wraps long content and scrolls to the newest answer`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height })
    await expect(
      page.getByRole('heading', { name: /A little clarity/ })
    ).toBeInViewport({ ratio: 1 })
    for (const suggestion of await page.locator('.suggestion').all()) {
      await expect(suggestion).toBeInViewport({ ratio: 1 })
    }
    await page.screenshot({
      path: testInfo.outputPath(`welcome-${width}.png`),
      fullPage: true,
    })
    const longText = 'A'.repeat(250)
    await page.route('**/api/chat', (route) =>
      route.fulfill({
        json: {
          ...grounded,
          answer: `${longText}\n${'A long paragraph of course information. '.repeat(60)}`,
          sources: [
            { title: longText, excerpt: longText },
            ...grounded.sources,
          ],
        },
      })
    )
    await ask(page, longText)
    await expect(page.locator('.source-card')).toHaveCount(3)
    await expect(page.getByRole('textbox')).toBeInViewport()
    await expect
      .poll(() =>
        page
          .getByRole('region', { name: 'Conversation history' })
          .evaluate(
            (element) =>
              element.scrollHeight - element.scrollTop - element.clientHeight
          )
      )
      .toBeLessThanOrEqual(2)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true)
    expect(
      await page
        .getByRole('region', { name: 'Conversation history' })
        .evaluate((element) => element.scrollWidth <= element.clientWidth)
    ).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath(`conversation-${width}.png`),
      fullPage: true,
    })
  })
}
