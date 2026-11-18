import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/lora'
import './styles/app.css'
import App from './App'
import { registerServiceWorker } from './services/pwa'

registerServiceWorker()
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
