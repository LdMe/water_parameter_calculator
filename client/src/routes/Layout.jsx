import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import LoggedInContext from "../context/loggedInContext";
import LocationContext from "../context/locationsContext";
import ParameterContext from "../context/parametersContext";
import ErrorContext from "../context/errorContext";
import { API_URL } from "../config";
import {getLocations as getLocationsApi} from "../utils/fetchLocation";
import { getParameters as getParametersApi } from "../utils/fetchParameter";

import { FaLocationDot, FaRulerCombined, FaMagnifyingGlass, FaRightFromBracket, FaRightToBracket, FaUser, FaUserPlus, FaHouse } from "react-icons/fa6";

import "../styles/Layout.scss";

const iconStyles = {
    color:"red",
}
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
        const response = await getLocationsApi();
        if(response.error){
            if(response.code === 401){
                navigate('/login');
            }
            console.log("error",response.error);
            return;
        }
        
        setLocations(response.data);
    }

    const getParameters = async () => {
        const response = await getParametersApi();
        if(response.error){
            if(response.code === 401){
                navigate('/login');
            }
            console.log("error",response.error);
            return;
        }
        setParameters(response.data);
    }

    return (
        <div>
            <header>
                <img className="banner" src="/banner.png" alt="banner" />
            </header>

            <main>
                <section className="title">
                <img className="title-image" src="/hydromnis.png" alg="logo"/><h1> HydrOmnis</h1>
                </section>
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
            <footer>
                <nav>


                    {loggedIn ?
                        <ul>

                            <li>
                                <Link to="/parameter/"><FaRulerCombined className="icon" title="Parameters" /></Link>
                            </li>
                            <li>
                                <Link to="/location"  ><FaLocationDot className="icon" title="Locations" /></Link>
                            </li>
                            <li>
                                <Link to="/calculate"  ><FaMagnifyingGlass className="icon" title="calculate" /></Link>
                            </li>
                            <li>
                                <Link to="/logout"  ><FaRightFromBracket className="icon" title="logout" /></Link>
                            </li>
                        </ul>

                        :
                        <ul>
                            <li>
                                <Link to="/"><FaHouse className="icon" title="Home" /></Link>
                            </li>
                            <li>
                                <Link to="/login"><FaRightToBracket className="icon" title="login" /></Link>
                            </li>
                            <li>
                                <Link to="/register"><FaUserPlus className="icon" title="register" /></Link>
                            </li>
                        </ul>
                    }

                </nav>
            </footer>
        </div>
    )
}

export default Layout;