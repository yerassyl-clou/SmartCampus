import { test, expect } from '@playwright/test'

test('production ignores the demo flag and displays API failures without invented answers', async ({
  page,
}) => {
  let payload
  await page.route('**/api/chat', (route) => {
    payload = route.request().postDataJSON()
    return route.fulfill({
      status: 503,
      json: { detail: 'Provider unavailable' },
    })
  })
  await page.route('**/api/deadlines', (route) =>
    route.fulfill({ json: { items: [], total: 0 } })
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'No deadlines to show' })).toBeVisible()
  await expect(page.getByText('Demo data · Mock mode')).toHaveCount(0)
  await page.getByRole('textbox').fill('Assignment deadline?')
  await page.getByRole('textbox').press('Enter')
  await expect(page.getByRole('alert')).toContainText(
    'The AI service is temporarily unavailable.'
  )
  expect(payload).toEqual({ question: 'Assignment deadline?' })
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toHaveCount(0)
})
