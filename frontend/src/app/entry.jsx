import React from 'react'
import { createRoot } from 'react-dom/client'

const synthetic = import.meta.env.VITE_RELEASE_MODE === 'synthetic'
const mode = import.meta.env.VITE_APP_MODE
const previousMode = import.meta.env.VITE_USE_MOCK_CHAT
const legacy = !synthetic && (mode === 'legacy' ||
  (!mode && (previousMode === 'true' || previousMode === 'false')))

if (legacy && (location.pathname === '/' || location.pathname === '/legacy')) {
  import('../main.jsx')
} else {
  import('./Shell.jsx').then(({ default: App }) => {
    const pathname = synthetic && location.pathname === '/legacy' ? '/' : location.pathname
    createRoot(document.getElementById('root')).render(<App pathname={pathname} />)
  })
}
