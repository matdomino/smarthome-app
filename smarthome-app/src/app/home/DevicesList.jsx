import { useState, useContext } from "react";
import DevicesContext from '../context/DevicesProvider';
import { useSelectedLayoutSegment } from "next/navigation";

export default function DevicesList () {
  const { devices, setDevices } = useContext(DevicesContext);
  const [ selected, setSelected ] = useState(null);

  const handleClick = (index) => {
    setSelected(index);
  };

  return(
    <>
      <ul>
        {devices.map((device, index) => (
          <li
          key={index}
          onClick={() => handleClick(index)}
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