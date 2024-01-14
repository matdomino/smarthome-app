import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: włącz/wyłącz klimatyzacje"}));
};

export default function SmartACSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <>
  <div>
    <label>Włącz/wyłącz klimatyzacje</label>
    <button onClick={() => turnOffOn(selectedData)}>&rarr;</button>
  </div>
  <div>
    
  </div>
  </>
  );
}