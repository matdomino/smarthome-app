"use client";

import { createContext, useState } from "react";

const DevicesContext = createContext({});

export const DevicesProvider = ({ children }) => {
    const [ devices, setDevices ] = useState([]);
    const [ AddDeviceMenu, setAddDeviceMenu ] = useState(false);

    return(
        <DevicesContext.Provider value={{ devices, setDevices, AddDeviceMenu, setAddDeviceMenu }}>
            {children}
        </DevicesContext.Provider>
    );
};

export default DevicesContext;