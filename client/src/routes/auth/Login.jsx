import { useEffect } from 'react';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import LoggedInContext from '../../context/loggedInContext';
import { useContext } from 'react';

const Login = ({isRegister=false,isLogout=false}) => {
    const {setLoggedIn} = useContext(LoggedInContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(isLogout){
            localStorage.removeItem('token');
            setLoggedIn(false);
            navigate('/');
        }
    },[]);
    const handlSubmit = async(e) => {
        try{
            e.preventDefault();
            const data = {
                email: e.target.email.value,
                password: e.target.password.value
            }
            let url = API_URL+"auth/register";
            if(!isRegister){
                url = API_URL+"auth/login";
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            if(!response.ok){
                throw new Error(json.message);
            }
            localStorage.setItem('token', json.token);
            setLoggedIn(true);
            navigate('/');

        }
        catch(err){
            console.log(err);
        }

    }
    if(isLogout){
        return <div>Logging out...</div>
    }
    return (
        <div>
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handlSubmit}>
                <label>
                    Email:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Login;
