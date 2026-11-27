/** Route mapping from the accepted FINAL-01 and FINAL-02 contracts. */
export const v2Routes = Object.freeze({
  landing: {path: '/', access: 'public'},
  privacy: {path: '/privacy', access: 'public'},
  signIn: {path: '/signin', access: 'public'},
  callback: {path: '/auth/callback', access: 'public'},
  demo: {path: '/demo', access: 'synthetic'},
  demoCourse: {path: '/demo/course/:slug', access: 'synthetic'},
  courses: {path: '/app/courses', access: 'verified-session'},
  course: {path: '/app/courses/:id', access: 'verified-session'},
  thread: {path: '/app/courses/:id/chats/:id', access: 'verified-session'},
  deadlines: {path: '/app/deadlines', access: 'verified-session'},
  settings: {path: '/app/settings', access: 'verified-session'},
  admin: {path: '/app/admin', access: 'verified-admin'},
});

const privateRoutes = Object.values(v2Routes).filter(route => route.access.startsWith('verified'))

export function matchRoute(pathname) {
  for (const [id, route] of Object.entries(v2Routes)) {
    const names = [...route.path.matchAll(/:(\w+)/g)].map(match => match[1])
    const pattern = route.path.replace(/:\w+/g, '([a-zA-Z0-9_-]{1,128})')
    const match = pathname.match(new RegExp(`^${pattern}${id==='landing'?'':'/?'}$`))
    if (match) return {...route, id, params: Object.fromEntries(names.map((name,i) => [name,match[i+1]]))}
  }
  return {id:'missing',access:pathname.startsWith('/app/')?'verified-session':'public',params:{}}
}

export function allowedReturn(value) {
  if (typeof value !== 'string' || !value.startsWith('/app/')) return v2Routes.courses.path
  const route = matchRoute(value)
  return privateRoutes.some(item => item.path === route.path) ? value : v2Routes.courses.path
}
