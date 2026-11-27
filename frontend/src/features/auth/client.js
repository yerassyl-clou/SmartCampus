import { createClient } from '@supabase/supabase-js'
import { authState } from './config.js'

let client
export function authClient(config) {
  client ??= createClient(config.authOrigin, config.key, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true },
  })
  return client
}

export async function verifySession(config, session, signal) {
  if (!session?.access_token) return {state:authState.signedOut}
  try {
    const response = await fetch(config.apiOrigin + '/api/v2/session', {
      headers: {Authorization: `Bearer ${session.access_token}`},
      cache:'no-store', credentials:'omit', redirect:'error',
      signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
    })
    if ([401,403].includes(response.status)) return {state:authState.denied}
    if (!response.ok) return {state:authState.unavailable}
    const {data} = await response.json()
    if (data?.verified !== true || data.allowed_mode !== 'workspace' ||
      typeof data.role !== 'string') return {state:authState.denied}
    return {state: authState.verified, role: data.role}
  } catch {
    return {state:authState.unavailable}
  }
}
