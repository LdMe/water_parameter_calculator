import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars,FaRightFromBracket,FaInfo } from "react-icons/fa6";
import {useLocation} from 'react-router-dom';

const LogoutInfoButtons = () => {
    const [show,setShow] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setShow(false);
    },[location]);

    return (
        <div className="logout-info-buttons">
            <div className="icon" onClick={() => setShow(!show)}>
                <FaBars />
            </div>
            {show && <div className="logout-info-buttons__buttons">
                <Link to="/" className="logout-info-buttons__button" onClick={()=>setShow(false)}>
                    <FaInfo />
                </Link>
                
                <Link to="/logout" className="logout-info-buttons__button">
                    <FaRightFromBracket />
                </Link>
            </div>}
        </div>
    )
}

export default LogoutInfoButtons;
