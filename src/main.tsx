import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import store from "./redux/store.ts"
import { Toaster } from "@/components/ui/toaster"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}><App/></Provider>
   <Toaster />
  </StrictMode>,
)
