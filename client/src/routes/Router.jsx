
import {createBrowserRouter,} from "react-router-dom";
import Layout from './Layout'
import ParameterEditor from '../components/parameter/ParameterEditor'
import Parameter from "./parameter/Parameter";
import ColorCalculator from './ColorCalculator'
import Login from './auth/Login';
import Locations from "./location/Locations";
import LocationComponent from "./location/Location";
import Home from "./home/Home";
import  { loadLocations,loadLocation } from "../loaders/locationLoader";

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
        path: "location/",
        element: <Locations />,
        loader: loadLocations,
        children: [
          {
            path: "",
            element:<p>Selecciona una ubicación</p>
          },
          {
            path: ":locationName",
            element: <LocationComponent />,
            loader: (req)=>loadLocation(req.params.locationName)
          }
        ]
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