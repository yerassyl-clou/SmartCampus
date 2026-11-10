import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
const { chromium } = createRequire(process.cwd() + '/package.json')('playwright')
const output = process.env.DASHBOARD_EVIDENCE ?? '../docs/sis1011/evidence/baseline'
const fixed = process.env.DASHBOARD_FIXED === '1'
const base = process.env.DASHBOARD_URL ?? 'http://127.0.0.1:5183'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
console.log('Chromium', browser.version(), new Date().toISOString(), 'Asia/Almaty; app clock 2026-11-10 12:00 local')
try {
  for (const [width,height] of [[1440,900],[768,1024],[375,812]]) {
    const page = await browser.newPage({ viewport: { width, height }, timezoneId: 'Asia/Almaty' })
    await page.clock.setFixedTime(new Date('2026-11-10T07:00:00Z'))
    const response = page.waitForResponse(res => res.url().endsWith('/api/deadlines'))
    await page.goto(base)
    const res = await response
    assert.equal(res.status(), 200)
    assert.equal(res.request().method(), 'GET')
    const payload = await res.json()
    const panel = page.locator('#upcoming-deadlines')
    const dates = panel.locator('time')
    await dates.last().waitFor()
    assert.equal(await dates.count(), 6)
    const expected = payload.items.map(item => item.due_date)
    assert.deepEqual(expected, [...expected].sort())
    const actual = await dates.evaluateAll(elements => elements.map(el => el.dateTime))
    assert.deepEqual([...actual].sort(), expected)
    for (const item of payload.items) {
      const card = panel.getByRole('listitem').filter({ has: page.getByRole('heading', {name:item.title, exact:true}) })
      assert.ok((await card.innerText()).includes(item.course_name))
      assert.ok((await card.innerText()).includes(item.source_title))
    }
    if (fixed) {
      const upcoming = await panel.getByRole('list', {name:'Upcoming deadlines'}).locator('time').evaluateAll(els => els.map(el => el.dateTime))
      const past = await panel.getByRole('list', {name:'Past deadlines'}).locator('time').evaluateAll(els => els.map(el => el.dateTime))
      assert.deepEqual(upcoming, expected.filter(date => date >= '2026-11-10'))
      assert.deepEqual(past, expected.filter(date => date < '2026-11-10'))
    } else {
      assert.deepEqual(actual, expected)
      assert.equal(actual.filter(date => date < '2026-11-10').length, 2)
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    const refresh = page.getByRole('button', {name:'Refresh deadlines'})
    for (let i = 0; i < 30 && !(await refresh.evaluate(el => el === document.activeElement)); i++) await page.keyboard.press('Tab')
    assert.ok(await refresh.evaluate(el => el === document.activeElement))
    const refreshed = page.waitForResponse(res => res.url().endsWith('/api/deadlines'))
    await page.keyboard.press('Enter')
    assert.equal((await refreshed).status(), 200)
    await refresh.waitFor({state:'visible'})
    await panel.screenshot({path:output + '/dashboard-' + width + '.png'})
    console.log(width, 'GET 200; 6 source-labeled dates:', actual.join(', '), '; no overflow; Tab/Enter refresh PASS')
    await page.close()
  }
  console.log(fixed ? 'SC-ISS-001 PASS: past dates are separate' : 'SC-ISS-001 FAIL (reproduced): 2 past dates appear under Upcoming deadlines')
} finally {
  await browser.close()
}
