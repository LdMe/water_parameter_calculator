import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

import LoggedInContext from "../context/loggedInContext";
import LocationContext from "../context/locationsContext";
import ParameterContext from "../context/parametersContext";
import Parameter from "../parameter";
import MessageContext,{defaultMessage} from "../context/messageContext";
import {getLocations as getLocationsApi} from "../utils/fetchLocation";
import { getParameters as getParametersApi } from "../utils/fetchParameter";
import LogoutInfoButtons from "../components/LogoutInfoButtons";

import { FaLocationDot, FaRulerCombined, FaMagnifyingGlass, FaRightFromBracket, FaRightToBracket, FaInfo, FaUserPlus, FaHouse } from "react-icons/fa6";

import "../styles/Layout.scss";
import PopUp from "../components/popUp/PopUp";


const Layout = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [locations, setLocations] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [message, setMessage] = useState(defaultMessage);
    const webLocation = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        }
        else {
            setLoggedIn(false);
            if (webLocation.pathname !== "/login" && webLocation.pathname !== "/register" && webLocation.pathname !== "/") { 
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
        const response = await getLocationsApi();
        if(response.error){
            if(response.code === 401){
                navigate('/login');
            }
            
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
            
            return;
        }
        const newParameters = Parameter.loadParametersFromJSON(response.data);
        
        setParameters(newParameters);
    }

    function handleSetMessage(message) {
        setMessage({
            message: message,
            isError: false
        });
    }
    function handleSetError(message) {
        setMessage({
            message: message,
            isError: true
        });
    }
    function handleClearMessage() {
        setMessage(defaultMessage);
    }

    return (
        <div>
            

            <main>
                <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
                    <LocationContext.Provider value={{ locations, getLocations }}>
                        <ParameterContext.Provider value={{ parameters, getParameters }}>
                            <MessageContext.Provider value={{ message, setMessage: handleSetMessage, setError: handleSetError }}>
                                {message.message && <PopUp className={message.isError ? "error" : "info"} onClose={handleClearMessage} autoCloseTime={5000} ><p>{message.message}</p></PopUp>}
                                <Outlet />
                            </MessageContext.Provider>
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
                                <LogoutInfoButtons />
                            </li>
                        </ul>

                        :
                        <ul>
                            <li>
                                <Link to="/"><FaInfo className="icon" title="Home" /></Link>
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