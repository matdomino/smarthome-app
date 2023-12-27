import { createContext, useContext, useState } from "react";

const AuthorizationContext = createContext();

export const AuthorizationProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        // dodac zapytanie do bazy

        setIsLoggedIn(true);
    }

    const logout = () => {
        setIsLoggedIn(false);
    }

    return(
        <AuthorizationContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthorizationContext.Provider>
    );
}

export default function useAuthorizaion () {
    return useContext(AuthorizationContext);
}