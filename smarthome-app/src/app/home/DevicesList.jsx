import { useState, useContext } from "react";
import DevicesContext from '../context/DevicesProvider';

export default function DevicesList () {
  const { devices, setDevices } = useContext(DevicesContext);
  return(
    <>
      <ul>
        <h3>Urządzenia</h3>
        {devices.map((device, index) => (
          <li key={index}>
            <div>
              <p>{device.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}