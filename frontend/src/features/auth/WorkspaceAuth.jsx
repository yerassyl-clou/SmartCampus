import React, { useEffect, useState } from 'react'
import { allowedReturn, v2Routes } from '../../app/v2Routes.js'
import { Action, Card } from '../../app/components.jsx'
import Workspace, {allowLocalWorkspaceFixture} from '../courses/Workspace.jsx'
import { authState, readAuthConfig } from './config.js'

export const authConfig = readAuthConfig(import.meta.env)
const callbackPath = v2Routes.callback.path
const returnKey = 'sc-v2-oauth-return'

function callbackParameters() {
  const params = new URLSearchParams(location.search)
  const fragment = new URLSearchParams(location.hash.slice(1))
  const error = params.get('error_code') || params.get('error') ||
    fragment.get('error_code') || fragment.get('error')
  const code = params.get('code')
  if (location.search || location.hash) history.replaceState(null, '', location.pathname)
  if (error === 'access_denied' || error === 'user_cancelled') return {state:authState.cancelled}
  if (error) return {state:authState.failed}
  return code ? {code} : {state:authState.expired}
}

function consumeReturn() {
  try {
    const next = allowedReturn(sessionStorage.getItem(returnKey))
    sessionStorage.removeItem(returnKey)
    return next
  } catch {
    return v2Routes.courses.path
  }
}

export function SignIn({ t }) {
  const [state, setState] = useState('')
  async function start() {
    setState(authState.loading)
    const next = allowedReturn(new URLSearchParams(location.search).get('next'))
    try {
      sessionStorage.setItem(returnKey, next)
      const { authClient } = await import('./client.js')
      const { data, error } = await authClient(authConfig).auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: location.origin + callbackPath, skipBrowserRedirect: true },
      })
      if (error || !data?.url || new URL(data.url).origin !== authConfig.authOrigin) throw Error()
      location.assign(data.url)
    } catch {
      consumeReturn()
      setState(authState.failed)
    }
  }
  return <Card narrow>
    <h1>{t('signin')}</h1>
    {authConfig ? <>
      <p>{t('signIntro')}</p>
      {state && <p className={state===authState.failed?'sc-error':''} role="status">{t(state)}</p>}
      <div className="sc-actions">
        <Action onClick={start} primary disabled={state===authState.loading}>{t('google')}</Action>
        <Action href="/demo">{t('demo')}</Action>
      </div>
    </> : <>
      <p className="sc-warm" role="status">{t('held')}</p>
      <Action href="/demo" primary>{t('demo')}</Action>
    </>}
  </Card>
}

export function AuthCallback({ t }) {
  const [result, setResult] = useState(authState.loading)
  useEffect(() => {
    const {code, state} = callbackParameters()
    const next = consumeReturn()
    if (state === authState.cancelled || state === authState.failed) {
      setResult(state)
      return
    }
    if (!authConfig || state) {
      setResult(authConfig ? state : authState.held)
      return
    }
    const controller = new AbortController()
    async function finish() {
      try {
        const {authClient,verifySession} = await import('./client.js')
        if (controller.signal.aborted) return
        const {data,error} = await authClient(authConfig).auth.exchangeCodeForSession(code)
        if (controller.signal.aborted) return
        if (error) {
          const stale = ['flow_state_expired','flow_state_not_found','bad_code_verifier'].includes(error.code)
          setResult(stale ? authState.expired : authState.failed)
          return
        }
        const verified = await verifySession(authConfig,data.session,controller.signal)
        if (controller.signal.aborted) return
        if (verified.state === authState.verified) location.replace(next)
        else setResult(verified.state)
      } catch {
        if (!controller.signal.aborted) setResult(authState.failed)
      }
    }
    finish()
    return () => controller.abort()
  }, [])
  return <Card narrow>
    <h1>{t('signin')}</h1>
    <p role="status">{t(result)}</p>
    <div className="sc-actions">
      {result !== authState.loading && authConfig && <Action href="/signin">{t('retry')}</Action>}
      <Action href="/demo" primary>{t('demo')}</Action>
    </div>
  </Card>
}

const headings = {
  courses:'courses', course:'course', thread:'chat', deadlines:'deadlines',
  settings:'settings', admin:'admin', missing:'routeMissing',
}

function useEligibility(attempt) {
  const [result,setResult] = useState({state:authConfig ? authState.loading : authState.held})
  useEffect(() => {
    if (!authConfig) return
    let current
    let subscription
    let active = true
    const verify = async (session,verifySession) => {
      current?.abort()
      const controller = new AbortController()
      current = controller
      if (active) setResult({state:authState.loading})
      const next = await verifySession(authConfig,session,controller.signal)
      if (active && !controller.signal.aborted) setResult({...next, owner:session?.user?.id})
    }
    import('./client.js').then(({authClient,verifySession}) => {
      if (!active) return
      const sdk = authClient(authConfig)
      const {data} = sdk.auth.onAuthStateChange((event,session) => {
        // Supabase releases its auth lock after this callback returns.
        if (event !== 'USER_UPDATED') queueMicrotask(() => {
          if (active) verify(session,verifySession)
        })
      })
      subscription = data.subscription
    }).catch(() => {
      if (active) setResult({state:authState.unavailable})
    })
    return () => {
      active = false
      current?.abort()
      subscription?.unsubscribe()
    }
  }, [attempt])
  return result
}

export function ProtectedPage({ route, t, locale }) {
  const [attempt,setAttempt] = useState(0)
  const [logout,setLogout] = useState('')
  const {state,role,owner} = useEligibility(attempt)
  const signIn = '/signin?next=' + encodeURIComponent(allowedReturn(location.pathname))
  const access = route.access === 'verified-admin' && role !== 'admin' && state === authState.verified
    ? authState.denied : state

  async function signOut() {
    setLogout(authState.loading)
    try {
      const {authClient} = await import('./client.js')
      const {error} = await authClient(authConfig).auth.signOut({scope:'local'})
      if (error) throw error
      consumeReturn()
      location.replace('/signin')
    } catch {
      setLogout('logoutError')
    }
  }

  if (logout) return <Card narrow>
    <h1>{t('personal')}</h1>
    <p role="status">{t(logout)}</p>
    {logout==='logoutError' && <Action onClick={signOut}>{t('retry')}</Action>}
  </Card>

  if (access !== authState.verified) return <Card narrow>
    <h1>{t('personal')}</h1>
    <p role="status" className="sc-warm">{t(access)}</p>
    <div className="sc-actions">
      {authConfig && [authState.signedOut,authState.denied].includes(access) &&
        <Action href={signIn}>{t('signin')}</Action>}
      {access === authState.unavailable && <Action onClick={()=>setAttempt(attempt+1)}>{t('retry')}</Action>}
      <Action href="/demo" primary>{t('demo')}</Action>
    </div>
  </Card>

  const fixture = typeof owner === 'string' && ['courses','course','deadlines'].includes(route.id) &&
    allowLocalWorkspaceFixture(authConfig, import.meta.env, location.origin)
  return <>
    {!fixture && <p className="sc-banner">{t('personal')}</p>}
    <nav aria-label={t('workspace')} className="sc-actions">
      {['courses','deadlines','settings',...(role==='admin'?['admin']:[])].map(id=>
        <Action key={id} href={v2Routes[id].path} aria-current={route.id === id ? 'page' : undefined}>{t(headings[id])}</Action>)}
    </nav>
    {fixture ? <Workspace key={owner} route={route} owner={owner} locale={locale}
      translate={t} signOut={signOut}/> : <Card>
      <h1>{t(headings[route.id])}</h1>
      <p role="status">{t('contentHold')}</p>
      <Action onClick={signOut}>{t('logout')}</Action>
    </Card>}
  </>
}
