import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { NotificationsProvider } from './state/NotificationsProvider.jsx'
import { ToastProvider } from './state/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationsProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </NotificationsProvider>
    </BrowserRouter>
  </StrictMode>,
)
