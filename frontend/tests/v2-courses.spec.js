import {expect, test} from '@playwright/test'
import {almatyDay, deadlineStatus} from '../src/features/courses/fixtureWorkspace.js'

const origin = 'http://127.0.0.1:5179'
const course = '/app/courses/academic-writing'
const eligibility = {verified:true, allowed_mode:'workspace', role:'student'}
const token = 'fixture-session-access-token'
const bytes = (size, fill = 0) => {
  const buffer = Buffer.alloc(size,fill)
  buffer.write('%PDF-')
  return buffer
}
const pdf = (name, buffer = bytes(64)) => ({name, mimeType:'application/pdf', buffer})
const dialog = page => page.getByRole('dialog')
const proof = (page, name) => process.env.FINAL10_CAPTURE_DIR && page.screenshot({
  path: process.env.FINAL10_CAPTURE_DIR + '/' + name + '.jpg', quality:90, fullPage:!name.includes('-source-'),
})

async function localSession(page, {owner = 'fixture-a', allowed = true} = {}) {
  const escaped = []
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === origin && url.pathname === '/api/v2/session') {
      expect(route.request().headers().authorization).toBe('Bearer '+token)
      return route.fulfill({status: allowed ? 200 : 403, json:{data:eligibility}})
    }
    if (url.origin === origin && !/^\/(api|auth|storage)\//.test(url.pathname)) return route.continue()
    escaped.push(url.origin + url.pathname)
    return route.abort()
  })
  await page.addInitScript(({origin,owner,token}) => {
    if (location.origin !== origin) return
    localStorage.setItem('sb-127-auth-token', JSON.stringify({
      access_token:token, refresh_token:'fixture-refresh', token_type:'bearer',
      expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,user:{id:owner,aud:'authenticated'},
    }))
  }, {origin, owner, token})
  return escaped
}

test('course CRUD, validation, confirmation and route persistence', async ({page}) => {
  const escaped = await localSession(page)
  await page.goto('/app/courses')
  const open = page.getByRole('button',{name:'New course'})
  await open.click()
  const name = dialog(page).getByRole('textbox',{name:'Course name'})
  await expect(name).toBeFocused()
  await name.fill(' '.repeat(2))
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await expect(dialog(page).getByRole('alert')).toContainText('1–80')
  await name.fill('Жобаларды басқару')
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await expect(open).toBeFocused()
  await page.getByRole('link',{name:'Жобаларды басқару'}).click()
  await expect(page.getByText('No documents yet.')).toBeVisible()
  await page.getByRole('button',{name:'Rename course'}).click()
  await name.fill('Project management')
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await page.reload()
  await expect(page.getByRole('heading',{name:'Project management'})).toBeVisible()
  await page.getByRole('button',{name:'Delete course'}).click()
  await expect(dialog(page).getByRole('button',{name:'Cancel'})).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button',{name:'Delete course'})).toBeFocused()
  await page.getByRole('button',{name:'Delete course'}).click()
  await dialog(page).getByRole('button',{name:'Delete course'}).click()
  await expect(page.getByRole('heading',{name:'Course unavailable'})).toBeFocused()
  expect(escaped).toEqual([])
})

test('bounded upload resumes at the chunk offset, hashes and rejects duplicate bytes', async ({page}) => {
  const escaped = await localSession(page)
  await page.goto(course)
  const pick = page.getByLabel('Choose a syllabus')
  await pick.setInputFiles({name:'notes.txt', mimeType:'text/plain', buffer:Buffer.from('test')})
  await expect(page.getByText('Choose a PDF or DOCX file.')).toBeVisible()
  await pick.setInputFiles(pdf('oversized.pdf',bytes(10_000_001)))
  await expect(page.getByText('Choose a nonempty file up to 10 MB.')).toBeVisible()
  const fixture = bytes(10_000_000)
  await pick.setInputFiles(pdf('fixture-interrupted.pdf', fixture))
  await page.getByRole('button',{name:'Upload syllabus'}).click()
  await expect(page.getByText('Transfer interrupted.')).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value','6291456')
  await proof(page, 'EV-FINAL-10-02-transfer-1440')
  await page.getByRole('button',{name:'Retry'}).click()
  const uploaded = page.getByRole('listitem').filter({hasText:'fixture-interrupted.pdf'})
  await expect(uploaded.getByText('Ready · fixture')).toBeVisible()
  await pick.setInputFiles(pdf('same-bytes.pdf', fixture))
  await page.getByRole('button',{name:'Upload syllabus'}).click()
  await expect(page.getByText('An identical document already exists')).toBeVisible()
  await uploaded.getByRole('button',{name:'Delete document'}).click()
  await dialog(page).getByRole('button',{name:'Delete document'}).click()
  await expect(uploaded).toHaveCount(0)
  expect(escaped).toEqual([])
})

test('cancellation, corrupt and scanned states, and expired reservation retry', async ({page}) => {
  await localSession(page)
  await page.goto(course)
  const pick = page.getByLabel('Choose a syllabus')
  const upload = page.getByRole('button',{name:'Upload syllabus'})
  await pick.setInputFiles(pdf('fixture-expired.pdf'))
  await upload.click()
  await page.getByRole('button',{name:'Cancel',exact:true}).click()
  await expect(page.getByText('Upload cancelled.')).toBeVisible()
  await page.getByRole('button',{name:'Retry'}).click()
  await expect(page.getByText('Upload lease expired.')).toBeVisible()
  await page.getByRole('button',{name:'Retry'}).click()
  await expect(page.getByRole('listitem').filter({hasText:'fixture-expired.pdf'})).toBeVisible()
  await pick.setInputFiles(pdf('corrupt.pdf', Buffer.from('corrupt')))
  await upload.click()
  await expect(page.getByText('The file signature could not be read.')).toBeVisible()
  await pick.setInputFiles(pdf('fixture-scanned.pdf'))
  await upload.click()
  await expect(page.getByText('No selectable text in this scanned PDF.')).toBeVisible()
})

test('date-only deadlines use the Almaty day and preserve candidate provenance', async ({page}) => {
  await localSession(page)
  await page.clock.setFixedTime(new Date('2026-11-27T19:00:00Z'))
  await page.goto(course)
  const newDeadline = page.getByRole('button',{name:'New deadline'})
  await newDeadline.click()
  const title = dialog(page).getByLabel('Title')
  const date = dialog(page).getByLabel('Due date (Almaty)')
  await title.fill('Course reading')
  await date.fill('2026-11-28')
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await expect(page.getByRole('heading',{name:'Due today'})).toBeVisible()
  const item = page.getByRole('listitem').filter({hasText:'Course reading'})
  await item.getByRole('button',{name:'Edit deadline'}).click()
  await date.fill('2026-11-27')
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await expect(page.getByRole('heading',{name:'Overdue'})).toBeVisible()
  await item.getByRole('button',{name:'Mark complete'}).click()
  await expect(page.getByRole('heading',{name:'Completed'})).toBeVisible()
  await item.getByRole('button',{name:'Reopen deadline'}).click()
  await expect(page.getByRole('heading',{name:'Overdue'})).toBeVisible()
  const relative = page.getByRole('listitem').filter({hasText:'Peer review'})
  await expect(relative.getByRole('button',{name:'Confirm',exact:true})).toBeDisabled()
  await relative.getByRole('button',{name:'Reject'}).click()
  await expect(relative).toHaveCount(0)
  await page.getByRole('button',{name:'Confirm',exact:true}).click()
  await dialog(page).getByRole('button',{name:'Save'}).click()
  await expect(page.getByText('Confirmed extraction')).toBeVisible()
  await page.getByRole('navigation',{name:'Study workspace'}).getByRole('link',{name:'Deadlines'}).click()
  await expect(page.getByText('Confirmed extraction')).toBeVisible()
  await proof(page, 'EV-FINAL-10-01-deadlines-1440')
  await item.getByRole('button',{name:'Delete deadline'}).click()
  await dialog(page).getByRole('button',{name:'Delete deadline'}).click()
  await expect(item).toHaveCount(0)
})

test('mobile keyboard focus and localized source navigation', async ({page}) => {
  const escaped = await localSession(page)
  await page.setViewportSize({width:375,height:812})
  await page.goto(course)
  await page.locator('header select').selectOption('ru')
  await expect(page.getByRole('button',{name:/Theme/})).toHaveCount(0)
  await page.locator('header button[aria-pressed=false]').click()
  await expect(page.locator('html')).toHaveAttribute('data-sc-theme','dark')
  await expect(page.getByRole('heading',{name:'Документы'})).toBeVisible()
  const source = page.getByRole('button',{name:'Фрагмент источника', exact:true}).first()
  await source.focus()
  await page.keyboard.press('Enter')
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).locator('blockquote')).toContainText('Week 8')
  await proof(page, 'EV-FINAL-10-03-source-375-ru-dark')
  await page.keyboard.press('Escape')
  await expect(source).toBeFocused()
  await page.locator('header select').selectOption('kk')
  await expect(page.getByRole('heading',{name:'Құжаттар'})).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang','kk')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  await proof(page, 'EV-FINAL-10-04-course-375-kk-dark')
  expect(escaped).toEqual([])
})

test('denied eligibility and foreign course never expose local workflow data', async ({page, context}) => {
  const denied = await localSession(page,{allowed:false})
  await page.goto(course)
  await expect(page.getByRole('status')).toBeVisible()
  await expect(page.getByText('Local QA workspace')).toHaveCount(0)
  expect(denied).toEqual([])
  const owner = await context.newPage()
  await localSession(owner)
  await owner.goto('/app/courses')
  await owner.getByRole('button',{name:'New course'}).click()
  await dialog(owner).getByLabel('Course name').fill('Private fixture course')
  await dialog(owner).getByRole('button',{name:'Save'}).click()
  const path = await owner.getByRole('link',{name:'Private fixture course'}).getAttribute('href')
  const other = await context.newPage()
  await localSession(other,{owner:'fixture-b'})
  await other.goto(path)
  await expect(other.getByRole('heading',{name:'Course unavailable'})).toBeVisible()
  expect(almatyDay(new Date('2026-11-27T18:59:59Z'))).toBe('2026-11-27')
  expect(deadlineStatus({due_on:'2026-11-27'},almatyDay(new Date('2026-11-27T19:00:00Z')))).toBe('overdue')
})

test('DOCX fixture stays local', async ({page}) => {
  const escaped = await localSession(page)
  await page.goto(course)
  await page.getByLabel('Choose a syllabus').setInputFiles({
    name:'outline.docx', mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    buffer:Buffer.from([80,75,3,4,0,0]),
  })
  await page.getByRole('button',{name:'Upload syllabus'}).click()
  await expect(page.getByRole('listitem').filter({hasText:'outline.docx'})).toBeVisible()
  expect(escaped).toEqual([])
})

for (const width of [375, 1440]) {
  test('locale and theme matrix at ' + width + 'px', async ({page}) => {
    await localSession(page)
    await page.setViewportSize({width,height:width === 375 ? 812 : 1000})
    await page.goto(course)
    for (const [locale,documents] of [['en','Documents'],['ru','Документы'],['kk','Құжаттар']]) {
      await page.locator('header select').selectOption(locale)
      for (const theme of ['light','dark']) {
        if (await page.locator('html').getAttribute('data-sc-theme') !== theme) {
          await page.locator('header button[aria-pressed]').click()
        }
        await expect(page.locator('html')).toHaveAttribute('lang',locale)
        await expect(page.locator('html')).toHaveAttribute('data-sc-theme',theme)
        await expect(page.getByRole('heading',{name:documents,exact:true})).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      }
    }
  })
}
