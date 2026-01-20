import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LicenseInfo } from '@mui/x-license'
import App from './app/App'
import './styles/globals.css'

// Initialize MUI X License
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE_KEY || '')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
