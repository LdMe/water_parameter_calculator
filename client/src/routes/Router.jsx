
import {createBrowserRouter,} from "react-router-dom";
import Layout from './Layout'
import ParameterEditor from './ParameterEditor'
import ColorCalculator from './ColorCalculator'
import Login from './auth/Login';
import Locations from "./Locations";
import LocationViewer from "./LocationViewer";

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
        path: "location/",
        element: <Locations />
      },
      {
        path: "location/:locationName",
        element: <LocationViewer />
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