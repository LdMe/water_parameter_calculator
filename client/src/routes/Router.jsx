
import {createBrowserRouter,} from "react-router-dom";
import Layout from './Layout'
import ParameterEditor from './ParameterEditor'
import ColorCalculator from './ColorCalculator'
import Login from './auth/Login';

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "/parameter/",
        element: <ParameterEditor />
      },
      {
        path: "/parameter/:parameterName",
        element: <ParameterEditor />
      },
      {
        path: "/calculate",
        element: <ColorCalculator />
        
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Login isRegister={true}/>
      },
      {
        path: "/logout",
        element: <Login isLogout={true}/>
      }

    ]
  }
])

export default BrowserRouter;