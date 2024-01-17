import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: włącz/wyłącz klimatyzacje"}));
};

const ChangeTemp = () => {
  const initialValues = {
    temp: '',
  };

  const validationSchema = Yup.object({
    temp: Yup.number().typeError("Temperatura musi być liczbą.").min(5, "Za niska temperatura.").max(40, "Za wysoka temperatura").required("Temperatura nie może być pusta")
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log("aisdbasd");

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
        <button type="submit">Zaloguj się</button>
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
      <button onClick={() => turnOffOn(selectedData)}>&rarr;</button>
    </div>
    <div>
      <ChangeTemp/>
    </div>
  </div>
  );
}