import { useState, useContext } from "react";
import DevicesContext from '../context/DevicesProvider';
import axios from "@/api/axios";

const GET_DEVICE = "/getdevice";

export default function DevicesList () {
  const { devices } = useContext(DevicesContext);
  const [ selected, setSelected ] = useState(null);
  const { selectedData, setSelectedData } = useContext(DevicesContext);

  const handleClick = async (index, device) => {
    console.log(device.deviceId);
    setSelected(index);
    const deviceId = device.deviceId;
    const deviceData = await axios.get (`${GET_DEVICE}/${deviceId}`, { withCredentials: true });
    console.log(deviceData.data);
  };

  return(
    <>
      <ul>
        {devices.map((device, index) => (
          <li
          key={index}
          onClick={() => handleClick(index, device)}
          className={selected === index ? 'selected' : ''}
          >
            <div>
              <p>{device.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}