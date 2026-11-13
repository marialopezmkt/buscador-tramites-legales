import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { PedidosProvider } from '@/context/PedidosContext'

// HashRouter: así el sitio funciona en GitHub Pages (alojamiento estático)
// sin necesitar configuración de servidor para las rutas internas.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PedidosProvider>
        <App />
      </PedidosProvider>
    </HashRouter>
  </StrictMode>,
)
