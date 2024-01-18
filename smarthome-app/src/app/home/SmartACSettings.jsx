import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: włącz/wyłącz klimatyzacje"}));
};

const ChangeTemp = ({ selectedData }) => {
  const initialValues = {
    temp: '',
  };

  const validationSchema = Yup.object({
    temp: Yup.number().typeError("Temperatura musi być liczbą.").min(5, "Za niska temperatura.").max(40, "Za wysoka temperatura").required("Temperatura nie może być pusta")
  });

  const onSubmit = async ( values, { resetForm }) => {
    client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: Ustaw temperature na:", value: values.temp}))

    resetForm();
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Zmień temperaturę:
          </label>
          <input
            type="text"
            name="temp"
            value={values.temp}
            onChange={handleChange}
          />
        </div>
        <div className='buttons'>
          <button className='submit' type="submit">Wyślij</button>
        </div>
        <div className='errs'>
          <span>{errors.temp}</span>
        </div>
      </form>
    </div>
  );
}

export default function SmartACSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <div>
    <div>
      <label>Włącz/wyłącz klimatyzacje</label>
      <div className='buttons'>
        <button className='turnOfOn' onClick={() => turnOffOn(selectedData)}>&rarr;</button>
      </div>
    </div>
    <ChangeTemp selectedData={selectedData} />
  </div>
  );
}