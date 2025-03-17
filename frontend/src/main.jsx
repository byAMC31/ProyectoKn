import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignInSide from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'

import NotFound from './components/NotFound/NotFound'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  //Definiciòn de path y componentes
  { 
    path: '/', element: <App/>
  },
  {
    path: 'login', element: <SignInSide/>
  },
  {
    path: 'Dashboard', element: <Dashboard/>
  },
  {
    path: '*', element: <NotFound/>
  }
  
]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={ router }/>
  </StrictMode>,
)