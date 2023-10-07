import { useEffect } from 'react';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import LoggedInContext from '../../context/loggedInContext';
import ErrorContext from '../../context/errorContext';
import { useContext } from 'react';
import {createDefaultParameters} from '../../utils/fetchParameter';
import { createLocation } from '../../utils/fetchLocation';

const Login = ({ isRegister = false, isLogout = false }) => {
    const { setLoggedIn } = useContext(LoggedInContext);
    const { setError } = useContext(ErrorContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLogout) {
            localStorage.removeItem('token');
            setLoggedIn(false);
            navigate('/');
        }
    }, []);
    const handleSubmit = async (e) => {
        
        try {
            e.preventDefault();
            if(e.target.email.value === "" || e.target.password.value === ""){
                setError("Please fill in all fields");
                return;
            }
            const data = {
                email: e.target.email.value,
                password: e.target.password.value
            }
            let url = API_URL + "auth/register";
            if (!isRegister) {
                url = API_URL + "auth/login";
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.message);
            }
            localStorage.setItem('token', json.token);
            setLoggedIn(true);
            if(isRegister){
                setTimeout(async() => {
                await createDefaultParameters();
                await createLocation("My Location");
                }, 1000);
            }
            navigate('/');

        }
        catch (err) {
            setError(err.message);
            console.log(err);
        }

    }
    if (isLogout) {
        return <div>Logging out...</div>
    }
    return (
        <div id="login-form">
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input type="text" name="email" id="email" />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                        <input type="password" name="password" id="password"/>
                </div>
                    <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Login;
