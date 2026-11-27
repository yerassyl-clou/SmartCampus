import fs from 'node:fs'
import path from 'node:path'
import { test, expect } from '@playwright/test'
import { dictionaries, translator } from '../src/i18n/locale.js'
import { allowedReturn, matchRoute } from '../src/app/v2Routes.js'
import { readAuthConfig } from '../src/features/auth/config.js'
import { readSyntheticCourse, replaySyntheticAnswer, researchBriefPrompt } from '../src/features/demo/syntheticReplay.js'

const captureDir = process.env.SMARTCAMPUS_V2_CAPTURE_DIR
const workspace = 'http://127.0.0.1:5177'

async function capture(page, id) {
  if (!captureDir) return
  fs.mkdirSync(captureDir,{recursive:true})
  await page.evaluate(()=>document.activeElement?.blur())
  await page.screenshot({path:path.join(captureDir,`${id}.jpg`),type:'jpeg',quality:83,fullPage:true})
}

test('contracts have locale parity, strict return paths and isolated fixture data', () => {
  for (const dictionary of Object.values(dictionaries)) {
    expect(Object.keys(dictionary)).toEqual(Object.keys(dictionaries.en))
    expect(Object.values(dictionary).every(value => value.trim())).toBe(true)
  }
  expect(translator('unknown')('signin')).toBe(dictionaries.en.signin)
  expect(allowedReturn('/app/courses/research/chats/thread-1')).toBe('/app/courses/research/chats/thread-1')
  for (const value of ['//evil.example', '/app/courses?code=no', '/app/%2fetc', '/app/courses#x','/app/unlisted']) {
    expect(allowedReturn(value)).toBe('/app/courses')
  }
  expect(matchRoute('/app/admin').access).toBe('verified-admin')
  expect(readAuthConfig({VITE_APP_MODE:'workspace'})).toBeNull()
  expect(readAuthConfig({VITE_APP_MODE:'workspace', VITE_RELEASE_MODE:'synthetic',
    VITE_SUPABASE_URL:workspace, VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'})).toBeNull()
  expect(readAuthConfig({VITE_APP_MODE:'public-demo', VITE_SUPABASE_URL:workspace,
    VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'})).toBeNull()
  expect(readAuthConfig({VITE_APP_MODE:'workspace', VITE_SUPABASE_URL:workspace,
    VITE_SUPABASE_PUBLISHABLE_KEY:'sb_secret_fixture'})).toBeNull()
  const clone = readSyntheticCourse('design-research')
  clone.deadlines[0].date = 'changed'
  expect(readSyntheticCourse(clone.slug).deadlines[0].date).toBe('2026-11-30')
  expect(replaySyntheticAnswer(clone.slug,'unlisted','en')).toBeNull()
  expect(replaySyntheticAnswer(clone.slug,researchBriefPrompt,'__proto__').locale).toBe('en')
})

for (const width of [1440,375]) {
  test.describe(`${width}px`, () => {
    test.use({viewport:{width,height:width===1440?1000:812}})

    test('public landing, locale/theme persistence and readable controls', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading',{name:dictionaries.en.headline})).toBeVisible()
      await capture(page,width===1440?'EV-FINAL-06-01-landing-1440':'EV-FINAL-06-02-landing-375')
      for (const locale of ['ru','kk','en']) {
        const dict = dictionaries[locale]
        await page.locator('select').selectOption(locale)
        await expect(page.locator('html')).toHaveAttribute('lang',locale)
        await expect(page.getByRole('heading',{name:dict.headline})).toBeVisible()
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width)
      }
      await page.locator('select').selectOption('kk')
      await page.getByRole('button',{name:'Тақырып · Жарық'}).click()
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang','kk')
      await expect(page.locator('html')).toHaveAttribute('data-sc-theme','dark')
      const contrast = await page.evaluate(()=>{
        function luminosity(rgb) {
          const linear = rgb.match(/[\d.]+/g).map(part=>Number(part)/255)
            .map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4)
          return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722
        }
        const style = getComputedStyle(document.querySelector('main .sc-primary'))
        const [lo,hi] = [luminosity(style.color),luminosity(style.backgroundColor)].sort((a,b)=>a-b)
        return (hi+.05)/(lo+.05)
      })
      expect(contrast).toBeGreaterThanOrEqual(4.5)
      expect(await page.locator('main .sc-primary').evaluate(node=>node.offsetHeight)).toBeGreaterThanOrEqual(44)
      await page.locator('.sc-skip').focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('main')).toBeFocused()
    })

    test('synthetic workspace, source, citation keyboard and deadline without requests', async ({ page }) => {
      const unexpected = []
      const errors = []
      page.on('pageerror',error=>errors.push(error.message))
      await page.route('**/*', route=>{
        const url = new URL(route.request().url())
        if (url.origin!=='http://127.0.0.1:5176' || /^\/(api|auth\/v1)(\/|$)/.test(url.pathname) ||
          route.request().method()!=='GET') {
          unexpected.push(url.pathname)
          return route.abort()
        }
        return route.continue()
      })
      await page.goto('/demo')
      await expect(page.getByText('Synthetic demo · Example replay')).toBeVisible()
      await expect(page.getByRole('heading',{name:'Sample deadline dashboard'})).toBeVisible()
      await capture(page,width===1440?'EV-FINAL-06-09-deadlines-1440':'EV-FINAL-06-10-deadlines-375')
      await page.getByRole('link',{name:'Open course'}).click()
      await expect(page.getByRole('button',{name:'1 · Syllabus, section 3'})).toHaveCount(0)
      await page.getByRole('button',{name:'Play sample answer'}).click()
      const citation = page.getByRole('button',{name:'1 · Syllabus, section 3'})
      await citation.focus()
      await page.keyboard.press('Enter')
      await expect(page.getByRole('dialog')).toContainText('November 30, 2026')
      await expect(page.getByRole('dialog').locator('blockquote')).toHaveAttribute('lang','en')
      await capture(page,width===1440?'EV-FINAL-06-11-citation-1440':'EV-FINAL-06-12-citation-375')
      await page.keyboard.press('Escape')
      await expect(citation).toBeFocused()
      if (width===375) {
        await page.getByRole('button',{name:'Documents',exact:true}).click()
        await expect(page.getByRole('button',{name:'Source excerpt'})).toBeVisible()
        await page.getByRole('button',{name:'Deadlines',exact:true}).click()
        await expect(page.locator('time')).toHaveAttribute('datetime','2026-11-30')
        await page.getByRole('button',{name:'Chat',exact:true}).click()
      }
      await capture(page,width===1440?'EV-FINAL-06-03-replay-1440':'EV-FINAL-06-04-replay-375')
      await page.locator('select').selectOption('ru')
      await expect(page.locator('.sc-answer')).toContainText(dictionaries.ru.answer)
      await page.getByRole('button',{name:'Тема · Светлая'}).click()
      await expect(page.locator('html')).toHaveAttribute('data-sc-theme','dark')
      await capture(page,width===1440?'EV-FINAL-06-05-replay-ru-dark-1440':'EV-FINAL-06-06-replay-ru-dark-375')
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width)
      await page.goto('/demo/course/unknown')
      await expect(page.getByRole('heading',{name:dictionaries.ru.unknownCourse})).toBeVisible()
      expect(unexpected).toEqual([])
      expect(errors).toEqual([])
    })

    test('held auth, cancellation, callback cleanup and direct private routes', async ({ page }) => {
      const requests = []
      await page.route('**/api/**',route=>{requests.push(route.request().url());return route.abort()})
      await page.goto('/signin')
      await expect(page.getByRole('status')).toHaveText(dictionaries.en.held)
      await expect(page.getByText('Continue with Google')).toHaveCount(0)
      await capture(page,width===1440?'EV-FINAL-06-07-held-1440':'EV-FINAL-06-08-held-375')
      await page.goto('/auth/callback?error=access_denied&error_description=fixture')
      await expect(page.getByRole('status')).toHaveText(dictionaries.en.cancelled)
      expect(new URL(page.url()).search).toBe('')
      await page.goto('/auth/callback?code=fake')
      await expect(page.getByRole('status')).toHaveText(dictionaries.en.held)
      expect(new URL(page.url()).search).toBe('')
      for (const route of ['/app/courses','/app/courses/example','/app/deadlines','/app/admin','/app/settings']) {
        await page.goto(route)
        await expect(page.getByRole('status')).toHaveText(dictionaries.en.held)
        await expect(page.getByText(dictionaries.en.contentHold)).toHaveCount(0)
      }
      expect(requests).toEqual([])
    })
  })
}

test('workspace-configured browser gates unsafe redirects and handles rejected PKCE codes', async ({page}) => {
  await page.route('**/auth/v1/authorize?**',async route=>{
    const query = new URL(route.request().url()).searchParams
    expect(query.get('provider')).toBe('google')
    expect(query.get('redirect_to')).toBe(workspace+'/auth/callback')
    expect(query.get('code_challenge_method')).toBe('s256')
    expect(query.get('code_challenge')).toBeTruthy()
    await route.fulfill({status:302,headers:{location:workspace+'/auth/callback?code=expired-fixture'}})
  })
  await page.route('**/auth/v1/token?**',async route=>{
    expect(route.request().postDataJSON()).toMatchObject({auth_code:'expired-fixture'})
    await route.fulfill({status:400,json:{error_code:'flow_state_expired',msg:'Fixture rejected'}})
  })
  await page.goto(workspace+'/signin?next='+encodeURIComponent('https://untrusted.example'))
  await page.getByRole('button',{name:dictionaries.en.google}).click()
  await expect(page.getByRole('status')).toHaveText(dictionaries.en.expired)
  expect(page.url()).toBe(workspace+'/auth/callback')
  await page.getByRole('link',{name:dictionaries.en.retry}).click()
  await expect(page.getByRole('button',{name:dictionaries.en.google})).toBeEnabled()
  await page.goto(workspace+'/app/admin')
  await expect(page.getByRole('status')).toHaveText(dictionaries.en.authRequired)
})

test('server eligibility gates the restored fixture session and logout', async ({page}) => {
  const token = 'fixture-session-access-token'
  await page.addInitScript(({value,origin})=>{
    if (location.origin!==origin || sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded','1')
    localStorage.setItem('sb-127-auth-token',JSON.stringify({
      access_token:value,refresh_token:'fixture-refresh',token_type:'bearer',
      expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,
      user:{id:'test-only',aud:'authenticated'},
    }))
  },{value:token,origin:workspace})
  let eligibility = {verified:true,allowed_mode:'workspace',role:'student'}
  await page.route('**/api/v2/session',async route=>{
    expect(route.request().headers().authorization).toBe('Bearer '+token)
    await route.fulfill({json:{data:eligibility,request_id:'local-fixture'}})
  })
  await page.route('**/auth/v1/logout?**',route=>route.fulfill({status:204}))
  await page.goto(workspace+'/app/courses')
  await expect(page.getByRole('heading',{name:dictionaries.en.courses})).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading',{name:dictionaries.en.courses})).toBeVisible()
  await page.goto(workspace+'/app/admin')
  await expect(page.getByRole('status')).toHaveText(dictionaries.en.denied)
  eligibility = {verified:false,allowed_mode:'workspace',role:'admin'}
  await page.goto(workspace+'/app/courses')
  await expect(page.getByRole('status')).toHaveText(dictionaries.en.denied)
  eligibility = {verified:true,allowed_mode:'workspace',role:'student'}
  await page.reload()
  await page.getByRole('button',{name:dictionaries.en.logout}).click()
  await expect(page).toHaveURL(workspace+'/signin')
  await page.goto(workspace+'/app/courses')
  await expect(page.getByRole('status')).toHaveText(dictionaries.en.authRequired)
})

test('successful PKCE fixture restores only the allowlisted route and leaves demo isolated', async ({page}) => {
  const token = 'fixture-only-accepted-token'
  let apiCalls = 0
  await page.route('**/auth/v1/authorize?**',route=>route.fulfill({
    status:302,headers:{location:workspace+'/auth/callback?code=success-fixture'},
  }))
  await page.route('**/auth/v1/token?**',async route=>{
    const body = route.request().postDataJSON()
    expect(body.auth_code).toBe('success-fixture')
    expect(body.code_verifier).toBeTruthy()
    await route.fulfill({json:{
      access_token:token,refresh_token:'fixture-only-refresh',token_type:'bearer',
      expires_in:3600,user:{id:'fixture-only',aud:'authenticated'},
    }})
  })
  await page.route('**/api/v2/session',async route=>{
    apiCalls += 1
    expect(route.request().headers().authorization).toBe('Bearer '+token)
    await route.fulfill({json:{
      data:{verified:true,allowed_mode:'workspace',role:'student'},request_id:'local-fixture',
    }})
  })
  await page.goto(workspace+'/signin?next='+encodeURIComponent('/app/deadlines'))
  await page.getByRole('button',{name:dictionaries.en.google}).click()
  await expect(page).toHaveURL(workspace+'/app/deadlines')
  await expect(page.getByRole('heading',{name:dictionaries.en.deadlines})).toBeVisible()
  expect(apiCalls).toBeGreaterThanOrEqual(2)
  const beforeDemo = apiCalls
  await page.goto(workspace+'/demo/course/design-research')
  await page.getByRole('button',{name:dictionaries.en.samplePrompt}).click()
  await expect(page.locator('.sc-answer')).toContainText(dictionaries.en.answer)
  expect(apiCalls).toBe(beforeDemo)
})
