import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
//import WebApp from "@twa-dev/sdk"



//WebApp.ready() // или await sdk.ready()

//// После этого можно безопасно работать с API
//WebApp.expand()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)