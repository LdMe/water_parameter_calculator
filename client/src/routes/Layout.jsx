import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import LoggedInContext from "../context/loggedInContext";
import LocationContext from "../context/locationsContext";
import ParameterContext from "../context/parametersContext";
import { API_URL } from "../config";

const Layout = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [locations, setLocations] = useState([]);
    const [parameters, setParameters] = useState([]);
    const webLocation = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        }
        else{
            if(webLocation.pathname !== "/login" && webLocation.pathname !== "/register"){
                setLoggedIn(false);
                navigate('/login');
            }

        }
    }, []);
    useEffect(() => {
        if (loggedIn) {
            getParameters();
            getLocations();
        }
    }, [loggedIn]);


    const getLocations = async () => {
        const response = await fetch(API_URL + "locations", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const json = await response.json();
        console.log("json", json)
        setLocations(json);
    }

    const getParameters = async () => {
        const response = await fetch(API_URL + "parameters", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const json = await response.json();
        console.log("json", json)
        setParameters(json);
    }

    return (
        <div>
            <header>
                <nav>

                    
                    {loggedIn ?
                        <ul>
                            <li>
                                <Link to="/parameter/">Edit parameter</Link>
                            </li>
                            <li>
                                <Link to="/location">My locations</Link>
                            </li>
                            <li>
                                <Link to="/calculate">calculate</Link>
                            </li>
                            <li>
                                <Link to="/logout">logout</Link>
                            </li>
                        </ul>

                        :
                        <ul>
                            <li>
                                <Link to="/login">login</Link>
                            </li>
                            <li>
                                <Link to="/register">register</Link>
                            </li>
                        </ul>
                    }

                </nav>
            </header>


            <h1>Water parameter calculator</h1>
            <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
                <LocationContext.Provider value={{ locations, setLocations }}>
                    <ParameterContext.Provider value={{ parameters, setParameters }}>
                        <Outlet />
                    </ParameterContext.Provider>
                </LocationContext.Provider>
            </LoggedInContext.Provider>
        </div>
    )
}

export default Layout;