import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PatientAuthProvider } from './context/PatientAuthContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <PatientAuthProvider>
        <App />
      </PatientAuthProvider>
    </ToastProvider>
  </StrictMode>,
)
