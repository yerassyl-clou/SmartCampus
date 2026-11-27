import React, { useEffect, useRef, useState } from 'react'
import { locales, readPreference, translator, writePreference } from '../i18n/locale.js'
import { Action, Card } from './components.jsx'
import { matchRoute } from './v2Routes.js'
import { AuthCallback, ProtectedPage, SignIn, authConfig } from '../features/auth/WorkspaceAuth.jsx'
import { DemoCourse, DemoHome } from '../features/demo/Demo.jsx'
import { formatDemoDate, readSyntheticCourse, sampleCourseSlug } from '../features/demo/syntheticReplay.js'
import '../styles/shell.css'

function Landing({ locale, t }) {
  const date = readSyntheticCourse(sampleCourseSlug).deadlines[0].date
  return <section className="sc-hero">
    <div>
      <p><span className="sc-tag">{t('workspace')}</span></p>
      <h1>{t('headline')}</h1>
      <p className="sc-intro">{t('intro')}</p>
      <div className="sc-actions sc-cta">
        <Action primary href="/demo">{t('demo')}</Action>
        <Action href="/signin">{t(authConfig ? 'google' : 'uiHold')}</Action>
      </div>
      <a href="/privacy">{t('privacy')}</a>
    </div>
    <div className="sc-poster">
      <Card>
        <p><span className="sc-tag">{t('synthetic')}</span></p>
        <h2>{t('course')}</h2>
        <p>{t('question')}</p>
        <div className="sc-answer"><p>{t('answer')}</p><small>{t('citation')}</small></div>
      </Card>
      <Card>
        <strong>{t('brief')}</strong>
        <p className="sc-warm"><time dateTime={date}>{formatDemoDate(date,locale)}</time></p>
      </Card>
    </div>
  </section>
}

function Page({ route, locale, t }) {
  if (route.access.startsWith('verified')) return <ProtectedPage route={route} t={t} />
  switch (route.id) {
    case 'landing': return <Landing locale={locale} t={t} />
    case 'signIn': return <SignIn t={t} />
    case 'callback': return <AuthCallback t={t} />
    case 'demo': return <DemoHome locale={locale} t={t} />
    case 'demoCourse': return <DemoCourse slug={route.params.slug} locale={locale} t={t} />
    case 'privacy': return <Card narrow>
      <h1>{t('privacy')}</h1><p>{t('privacyText')}</p><p>{t('guestReadOnly')}</p>
      <Action href="/demo">{t('demo')}</Action>
    </Card>
    default: return <Card narrow>
      <h1>{t('routeMissing')}</h1><Action href="/" primary>{t('home')}</Action>
    </Card>
  }
}

export default function Shell() {
  const [locale,setLocale] = useState(()=>{
    const preferred = readPreference('sc-v2-locale')
    return locales.includes(preferred) ? preferred : 'en'
  })
  const [theme,setTheme] = useState(()=>readPreference('sc-v2-theme')==='dark'?'dark':'light')
  const t = translator(locale)
  const route = matchRoute(location.pathname)
  const main = useRef(null)

  useEffect(()=>{
    document.documentElement.lang = locale
    writePreference('sc-v2-locale',locale)
  },[locale])
  useEffect(()=>{
    document.documentElement.dataset.scTheme = theme
    writePreference('sc-v2-theme',theme)
  },[theme])
  const nav = [
    {href:'/demo',key:'demo',active:route.access==='synthetic'},
    {href:'/signin',key:'signin',active:['signIn','callback'].includes(route.id)},
    {href:'/privacy',key:'privacy',active:route.id==='privacy'},
  ]

  return <div className="sc-shell">
    <a href="#sc-main" className="sc-skip" onClick={event=>{
      event.preventDefault()
      main.current.focus()
    }}>{t('skip')}</a>
    <header className="sc-header">
      <div className="sc-bar">
        <a href="/" className="sc-brand" aria-current={route.id==='landing'?'page':undefined}>
          <img src="/mark.svg" alt="" width="40" height="40" />SmartCampus
        </a>
        <div className="sc-actions sc-preferences">
          <select value={locale} aria-label={t('language')} onChange={event=>setLocale(event.target.value)}>
            {locales.map(value=><option key={value} value={value}>{value.toUpperCase()}</option>)}
          </select>
          <Action aria-pressed={theme==='dark'} aria-label={t('theme')+' · '+t(theme)}
            onClick={()=>setTheme(theme==='light'?'dark':'light')}>{t(theme==='light'?'dark':'light')}</Action>
        </div>
        <nav aria-label={t('navigation')} className="sc-nav">
          {nav.map(item=><a href={item.href} key={item.key}
            aria-current={item.active?'page':undefined}>{t(item.key)}</a>)}
        </nav>
      </div>
    </header>
    <main id="sc-main" ref={main} tabIndex="-1">
      <Page route={route} locale={locale} t={t} />
    </main>
  </div>
}
