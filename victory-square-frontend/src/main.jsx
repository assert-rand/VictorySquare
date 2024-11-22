import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js';
import App from './App.jsx'
import { ContextProvider } from './Context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <App /> 
    </ContextProvider>
  </StrictMode>,
)
