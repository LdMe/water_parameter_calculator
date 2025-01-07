
import {createBrowserRouter,} from "react-router-dom";
import Layout from './Layout'
import Parameter from "./parameter/Parameter";
import Login from './auth/Login';
import Locations from "./location/Locations";
import LocationComponent from "./location/Location";
import LocationRoutes from "./location/LocationRoutes";
import Home from "./home/Home";
import OnboardingGuide from "./onboarding/Onboarding";
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
        path: "/onboard",
        element: <OnboardingGuide />
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
            element:<LocationRoutes/>
          },
          {
            path: ":locationName",
            element: <LocationComponent />,
            loader: (req)=>loadLocation(req.params.locationName)
          }
        ]
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