import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const require = createRequire(new URL('../../../../frontend/package.json', import.meta.url))
const { chromium, expect } = require('@playwright/test')
const BASE_URL = process.env.SIS13_BASE_URL ?? 'http://127.0.0.1:5193'
const OUT = process.argv[2]
if (!OUT) throw new Error('Usage: node capture-sc-iss-003.mjs <capture-directory>')

const starter = 'Where can I find information about course deadlines?'
const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })
try {
  console.log('Chromium', browser.version())
  for (const { width, height } of [{ width: 1440, height: 1000 }, { width: 375, height: 812 }]) {
    const page = await browser.newPage({ viewport: { width, height }, timezoneId: 'Asia/Almaty' })
    await page.clock.setFixedTime(new Date('2026-11-23T08:00:00+05:00'))
    const deadlineResponse = page.waitForResponse(response => response.url() === BASE_URL + '/api/deadlines')
    await page.goto(BASE_URL)
    const deadlines = await deadlineResponse
    assert.equal(deadlines.status(), 200)
    assert.equal((await deadlines.json()).total, 6)
    await expect(page.locator('#upcoming-deadlines time')).toHaveCount(6)

    const suggestion = page.getByRole('button', { name: /Where can I find information about course deadlines/ })
    let tabCount = 0
    while (!(await suggestion.evaluate(element => element === document.activeElement)) && tabCount < 20) {
      await page.keyboard.press('Tab')
      tabCount += 1
    }
    await expect(suggestion).toBeFocused()
    const outline = await suggestion.evaluate(element => {
      const style = getComputedStyle(element)
      return { style: style.outlineStyle, width: style.outlineWidth, color: style.outlineColor }
    })
    await page.screenshot({ path: resolve(OUT, `sis13-08-sc-iss-003-baseline-focus-${width}.png`), animations: 'disabled' })
    await page.keyboard.press('Enter')
    await expect(page.getByRole('textbox')).toBeFocused()
    await expect(page.getByRole('textbox')).toHaveValue(starter)

    const chatResponse = page.waitForResponse(response => response.url() === BASE_URL + '/api/chat')
    await page.keyboard.press('Enter')
    const chat = await chatResponse
    const result = await chat.json()
    assert.equal(chat.status(), 200)
    assert.deepEqual(chat.request().postDataJSON(), { question: starter })
    assert.equal(result.grounded, false)
    assert.deepEqual(result.sources, [])
    const warning = page.getByText(/No supporting course evidence was found/)
    await expect(warning).toBeVisible()
    const warningColors = await warning.evaluate(element => {
      const foreground = getComputedStyle(element).color
      let background = getComputedStyle(element).backgroundColor
      while (background === 'rgba(0, 0, 0, 0)' && element.parentElement) {
        element = element.parentElement
        background = getComputedStyle(element).backgroundColor
      }
      return { foreground, background }
    })
    await expect(page.getByRole('region', { name: 'Upcoming deadlines', exact: true })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    assert.equal(overflow, false)
    await page.screenshot({ path: resolve(OUT, `sis13-08-sc-iss-003-baseline-chat-${width}.png`),
      animations: 'disabled', fullPage: true })
    console.log(JSON.stringify({ width, height, tabCount, outline, warningColors, overflow, deadlineTotal: 6,
      chatStatus: chat.status(), grounded: result.grounded, sources: result.sources.length }))
    await page.close()
  }
} finally {
  await browser.close()
}
