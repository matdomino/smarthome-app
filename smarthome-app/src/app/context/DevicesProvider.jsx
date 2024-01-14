"use client";

import { createContext, useState } from "react";

const DevicesContext = createContext({});

export const DevicesProvider = ({ children }) => {
    const [ devices, setDevices ] = useState([]);
    const [ menu, setMenu ] = useState(null);
    const [ selectedData, setSelectedData ] = useState(null);

    return(
        <DevicesContext.Provider value={{ devices, setDevices, menu, setMenu, selectedData, setSelectedData }}>
            {children}
        </DevicesContext.Provider>
    );
};

export default DevicesContext;