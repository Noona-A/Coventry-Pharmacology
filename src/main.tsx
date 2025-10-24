import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { useGame, BRAIN_COSMETICS } from './store'

// Expose store to window for admin commands (development only)
if (import.meta.env.DEV) {
  ;(window as any).useGame = useGame
  ;(window as any).BRAIN_COSMETICS = BRAIN_COSMETICS
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* basename makes Pages + local dev both work */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
