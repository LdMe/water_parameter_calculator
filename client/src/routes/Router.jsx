
import {createBrowserRouter,} from "react-router-dom";
import Layout from './Layout'
import ParameterEditor from './parameter/ParameterEditor'
import Parameter from "./parameter/Parameter";
import ColorCalculator from './ColorCalculator'
import Login from './auth/Login';
import Locations from "./Locations";
import LocationViewer from "./LocationViewer";
import Home from "./home/Home";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },

      {
        path: "/parameter/",
        element: <Parameter />
      },
      {
        path: "/parameter/new",
        element: <ParameterEditor />
      },
      {
        path: "/parameter/:name",
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