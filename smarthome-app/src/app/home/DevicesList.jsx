import { useState, useContext } from "react";
import DevicesContext from '../context/DevicesProvider';
import { useRouter } from "next/navigation";
import axios from "@/api/axios";

const GET_DEVICE = "/getdevice";

export default function DevicesList () {
  const { devices } = useContext(DevicesContext);
  const [ selected, setSelected ] = useState(null);
  const { setSelectedData } = useContext(DevicesContext);
  const router = useRouter();

  const handleClick = async (index, device) => {
    setSelected(index);
    const deviceId = device.deviceId;

    try {
      const deviceData = await axios.get (`${GET_DEVICE}/${deviceId}`, { withCredentials: true });

      if (deviceData.data.status === "success") {
        setSelectedData(deviceData.data);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          router.push('/');
        }
        alert(err.response.data.error);
      } else {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      }
    }
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