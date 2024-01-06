import { useState, useContext } from "react";
import DevicesContext from '../context/DevicesProvider';

export default function DevicesList () {
  const { devices, setDevices } = useContext(DevicesContext);
  return(
    <>
    </>
  );
}