import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { loadConfig } from './lib/config'
import { backendConfigured, initBackend } from './lib/supabase'
import { startConnectivity } from './lib/connectivity'

// Learner data is no longer kept on the device: remove what older versions saved.
try {
  localStorage.removeItem('mousik')
  localStorage.removeItem('mousik-local-user')
} catch {
  // storage unavailable
}

// Load the environment's runtime config before anything talks to the backend.
loadConfig().then(async () => {
  await initBackend()
  // Mousik is online-only: the app opens once the backend has been reached.
  if (backendConfigured) startConnectivity()
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
