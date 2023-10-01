import {createContext} from 'react';

const LoggedInContext = createContext({
    isLoggedIn:false,
    setIsLoggedIn: () => {}
});

export default LoggedInContext;