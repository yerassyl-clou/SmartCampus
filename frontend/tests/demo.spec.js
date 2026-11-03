import { test, expect } from '@playwright/test'

test('explicit demo mode is labeled, returns fictional sources, and never calls the backend', async ({
  page,
}) => {
  let requests = 0
  page.on('request', (request) => {
    if (request.url().endsWith('/api/chat')) requests++
  })
  await page.goto('/')
  await expect(page.getByText('Demo data · Mock mode')).toBeVisible()
  await page.getByRole('button', { name: /Stay ahead of deadlines/ }).click()
  await page.getByRole('textbox').press('Enter')
  await expect(page.getByRole('status')).toBeVisible()
  await expect(
    page.getByText(/Demo example: Database Systems Assignment 2/)
  ).toBeVisible()
  await expect(page.locator('.source-card')).toHaveCount(2)
  await expect(
    page.getByRole('heading', { name: /Demo sources/ })
  ).toBeVisible()
  await page.getByRole('textbox').fill('What are the project requirements?')
  await page.getByRole('textbox').press('Enter')
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' })
  ).toHaveCount(2)
  await expect(
    page.getByRole('article', { name: 'SmartCampus response' }).last()
  ).toContainText('This answer is not verified.')
  expect(requests).toBe(0)
})
