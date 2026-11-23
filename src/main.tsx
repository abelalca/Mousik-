import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { loadConfig } from './lib/config'
import { initBackend } from './lib/supabase'

// Load the environment's runtime config before anything talks to the backend.
loadConfig().then(async () => {
  await initBackend()
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
