export const authState = Object.freeze({
  held: 'held', loading: 'authChecking', signedOut: 'authRequired',
  cancelled: 'cancelled', expired: 'expired', failed: 'authFailure',
  denied: 'denied', unavailable: 'authUnavailable', verified: 'verified',
})

function safeOrigin(value) {
  try {
    const url = new URL(value)
    if (url.href !== url.origin + '/' || url.username || url.password) return null
    if (url.protocol === 'https:' || (url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) return url.origin
  } catch { /* Invalid build configuration is held. */ }
  return null
}

export function readAuthConfig(env) {
  if (env.VITE_APP_MODE !== 'workspace' || env.VITE_RELEASE_MODE === 'synthetic') return null
  const authOrigin = safeOrigin(env.VITE_SUPABASE_URL)
  const apiOrigin = env.VITE_API_BASE_URL ? safeOrigin(env.VITE_API_BASE_URL) : ''
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!authOrigin || apiOrigin === null || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key || '')) return null
  return Object.freeze({authOrigin, apiOrigin, key})
}
