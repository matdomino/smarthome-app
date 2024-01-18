import { useContext } from 'react';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: włącz/wyłącz termometr"}));
};

export default function ThermometerSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <div>
    <div>
      <label>Włącz/wyłącz termometr</label>
      <div className='buttons'>
        <button className='turnOfOn' onClick={() => turnOffOn(selectedData)}>&rarr;</button>
      </div>
    </div>
  </div>
  );
}