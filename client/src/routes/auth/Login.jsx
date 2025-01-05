import { useEffect } from 'react';
import { API_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import LoggedInContext from '../../context/loggedInContext';
import MessageContext from '../../context/messageContext';
import { useContext } from 'react';

import './Login.scss';
const Login = ({ isRegister = false, isLogout = false }) => {
    const { setLoggedIn } = useContext(LoggedInContext);
    const { setError } = useContext(MessageContext);
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
            if (e.target.email.value === "" || e.target.password.value === "") {
                setError("Rellena todos los campos");
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
            navigate('/');

        }
        catch (err) {
            setError(err.message);
        }

    }
    if (isLogout) {
        return <div>Logging out...</div>
    }
    return (
        <div className="login__form">
            <h2>{isRegister ? "Registro" : "Login"}</h2>
            <form  className="login__form__form" onSubmit={handleSubmit}>
                <div className="login__form__input">
                    <label htmlFor='email'>Email:</label>
                    <input type="text" name="email" id="email" placeholder='tu.correo@email.com' />
                </div>
                <div className="login__form__input">
                    <label htmlFor='password'>Contraseña:</label>
                    <input type="password" name="password" id="password" placeholder='•••••••' />
                </div>
                {isRegister && (
                    <div className="login__form__input">
                        <label htmlFor='passwordConfirm'>Confirmar contraseña:</label>
                        <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder='•••••••' />
                    </div>
                )}
                <div className="login__form__input">
                    <input className="login__form__submit" type="submit" value={isRegister ? "Crear Cuenta" : "Iniciar Sesión"} />
                </div>
            </form>
            <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}</Link>
        </div>
    )
}

export default Login;
