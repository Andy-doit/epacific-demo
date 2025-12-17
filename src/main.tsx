import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { QueryProvider } from './providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      
      <QueryProvider>
        <App />
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </Provider>
  </StrictMode>,
)
