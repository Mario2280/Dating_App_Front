import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { TonConnectProvider } from './components/ton-connect-provider'


window.addEventListener('unload', () => {
  localStorage.clear()
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectProvider>
    <App />
    </TonConnectProvider>
  </React.StrictMode>,
)