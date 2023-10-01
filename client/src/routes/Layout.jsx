import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import LoggedInContext from "../context/loggedInContext";
import LocationContext from "../context/locationsContext";
import ParameterContext from "../context/parametersContext";
import ErrorContext from "../context/errorContext";
import { API_URL } from "../config";
import {FaLocationDot,FaRulerCombined,FaCalculator,FaRightFromBracket,FaUser,FaUserPlus} from "react-icons/fa6";

import "../styles/Layout.scss";

const Layout = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [locations, setLocations] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [error, setError] = useState(null);
    const webLocation = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        }
        else {
            if (webLocation.pathname !== "/login" && webLocation.pathname !== "/register") {
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

    useEffect(() => {
        setTimeout(() => {
            setError(null);
        }, 5000);
    }, [error]);




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
                                <Link to="/parameter/"><FaRulerCombined title="Parameters"/></Link>
                            </li>
                            <li>
                                <Link to="/location"><FaLocationDot title="Locations"/></Link>
                            </li>
                            <li>
                                <Link to="/calculate"><FaCalculator title="calculate"/></Link>
                            </li>
                            <li>
                                <Link to="/logout"><FaRightFromBracket title="logout"/></Link>
                            </li>
                        </ul>

                        :
                        <ul>
                            <li>
                                <Link to="/login"><FaUser title="login"/></Link>
                            </li>
                            <li>
                                <Link to="/register"><FaUserPlus title="register"/></Link>
                            </li>
                        </ul>
                    }

                </nav>
            </header>

            <main>
                <h1>Water parameter calculator</h1>
                <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
                    <LocationContext.Provider value={{ locations, setLocations }}>
                        <ParameterContext.Provider value={{ parameters, setParameters }}>
                            <ErrorContext.Provider value={{ error, setError }}>
                                {error && <div className="error">{error}</div>}
                                <Outlet />
                            </ErrorContext.Provider>
                        </ParameterContext.Provider>
                    </LocationContext.Provider>
                </LoggedInContext.Provider>
            </main>
        </div>
    )
}

export default Layout;