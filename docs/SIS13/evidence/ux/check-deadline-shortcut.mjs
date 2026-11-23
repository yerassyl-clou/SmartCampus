import { createRequire } from 'node:module'

const require = createRequire(new URL('../../../../frontend/package.json', import.meta.url))
const { chromium, expect } = require('@playwright/test')

const args = process.argv.slice(2)
if (args.some(arg => arg !== '--reference') || args.length > 1) {
  throw new Error('Usage: node check-deadline-shortcut.mjs [--reference]')
}

// Reference mode checks the existing sidebar link on the baseline app.
const reference = args.includes('--reference')
const baseUrl = process.env.SIS13_BASE_URL ?? 'http://127.0.0.1:5193'
const viewports = [{ width: 1440, height: 1000 }, { width: 375, height: 812 }]
const browser = await chromium.launch()
let failures = 0

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, timezoneId: 'Asia/Almaty' })
    try {
      await page.clock.setFixedTime(new Date('2026-11-23T08:00:00+05:00'))
      const deadlinesResponse = page.waitForResponse(response => response.url() === baseUrl + '/api/deadlines')
      const chatPosts = []
      page.on('request', request => {
        if (request.url() === baseUrl + '/api/chat' && request.method() === 'POST') {
          chatPosts.push(request)
        }
      })
      await page.goto(baseUrl)
      const response = await deadlinesResponse
      expect(response.status()).toBe(200)
      expect((await response.json()).total).toBe(6)

      const shortcut = reference
        ? page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Course deadlines' })
        : page.locator('.suggestions').getByRole('link', { name: /deadline/i })
      await expect(shortcut).toHaveAttribute('href', '#upcoming-deadlines', { timeout: 2000 })
      for (let step = 0; step < 20; step += 1) {
        await page.keyboard.press('Tab')
        if (await shortcut.evaluate(element => element === document.activeElement)) break
      }
      await expect(shortcut).toBeFocused()
      await page.keyboard.press('Enter')

      const panel = page.getByRole('region', { name: 'Course deadlines', exact: true })
      await expect(page).toHaveURL(/#upcoming-deadlines$/)
      await expect(panel).toBeFocused()
      await expect(panel.getByRole('heading', { name: 'Course deadlines', exact: true })).toBeInViewport()
      await expect(panel.locator('time')).toHaveCount(6)
      await expect(page.getByText(/No supporting course evidence was found/)).toHaveCount(0)
      expect(chatPosts).toHaveLength(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)

      const fallbackResponse = page.waitForResponse(result => result.url() === baseUrl + '/api/chat')
      const composer = page.getByRole('textbox', { name: 'Your question' })
      await composer.fill('Is there a timetable for interplanetary lava surfing?')
      await composer.press('Enter')
      const fallback = await fallbackResponse
      expect(fallback.status()).toBe(200)
      expect(await fallback.json()).toMatchObject({ grounded: false, sources: [] })
      await expect(page.getByText(/No supporting course evidence was found/)).toBeVisible()
      expect(chatPosts).toHaveLength(1)
      console.log(`${viewport.width}×${viewport.height}: ${reference ? 'sidebar reference' : 'welcome shortcut'} passed`)
    } catch (error) {
      failures += 1
      console.error(`${viewport.width}×${viewport.height}: ${error.message}`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}

console.log(`${reference ? 'Reference' : 'Proposed welcome shortcut'} failures: ${failures}/${viewports.length}`)
process.exitCode = failures ? 1 : 0
