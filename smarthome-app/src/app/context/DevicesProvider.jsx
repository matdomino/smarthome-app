"use client";

import { createContext, useState } from "react";

const DevicesContext = createContext({});

export const DevicesProvider = ({ children }) => {
    const [ devices, setDevices ] = useState([]);
    const [ menu, setMenu ] = useState(null);

    return(
        <DevicesContext.Provider value={{ devices, setDevices, menu, setMenu }}>
            {children}
        </DevicesContext.Provider>
    );
};

export default DevicesContext;