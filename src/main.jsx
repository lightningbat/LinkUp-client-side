import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CustomDialogsProvider } from './custom/dialogs/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomDialogsProvider>
      <App />
    </CustomDialogsProvider>
  </StrictMode>,
)
