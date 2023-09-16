import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './routes/Layout'
import ParameterEditor from './routes/ParameterEditor'
import ColorCalculator from './routes/ColorCalculator'

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/parameter/:parameterName",
        element: <ParameterEditor />
      },
      {
        path: "/calculate",
        element: <ColorCalculator />
        
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={BrowserRouter} />
  </React.StrictMode>,
)
