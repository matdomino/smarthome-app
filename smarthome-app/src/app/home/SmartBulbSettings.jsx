import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: włącz/wyłącz żarówke"}));
};

const ChangeBrightness = ({ selectedData }) => {
  const initialValues = {
    brightness: '',
  };

  const validationSchema = Yup.object({
    brightness: Yup.number().typeError("Poziom musi być liczbą.").integer("Poziom musi być liczbą całkowitą.").min(1, "Za niski poziom jasności.").max(100, "Za wysoki poziom jasności.").required("Poziom jasności nie może być pusty.")
  });

  const onSubmit = async ( values, { resetForm }) => {
    client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: zmień jasność na:", value: values.brightness}));

    resetForm();
  };

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
            Zmień jasność:
          </label>
          <input
            type="text"
            name="brightness"
            value={values.brightness}
            onChange={handleChange}
          />
        </div>
        <div className='buttons'>
          <button className='submit' type="submit">Wyślij</button>
        </div>
        <div className='errs'>
          <span>{errors.brightness}</span>
        </div>
      </form>
    </div>
  );
};

export default function SmartBulbSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <div>
    <div>
      <label>Włącz/wyłącz żarówke</label>
      <div className='buttons'>
        <button className='turnOfOn' onClick={() => turnOffOn(selectedData)}>&rarr;</button>
      </div>
    </div>
    <ChangeBrightness selectedData={selectedData} />
  </div>
  );
}