import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const turnOffOn = (selectedData) => {
  client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: zamknij/otwórz"}));
};

const ChangePIN = ({ selectedData }) => {
  const initialValues = {
    PIN: '',
  };

  const validationSchema = Yup.object({
    PIN: Yup.string().min(4, "Za krótki PIN.").max(4, "Za długi PIN.").matches(/^[0-9]+$/, "PIN musi składać się tylko z cyfr.").required("PIN nie może być pusty.")
  });

  const onSubmit = async ( values, { resetForm }) => {
    client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: zmień PIN", pin: values.PIN}))

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
            Zmień PIN:
          </label>
          <input
            type="password"
            name="PIN"
            value={values.PIN}
            onChange={handleChange}
          />
        </div>
        <div className='buttons'>
          <button className='submit' type="submit">Wyślij</button>
        </div>
        <div className='errs'>
          <span>{errors.PIN}</span>
        </div>
      </form>
    </div>
  );
};

export default function SmartLockSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <div>
    <div>
      <label>Otwórz/zamknij zamek</label>
      <div className='buttons'>
        <button className='turnOfOn' onClick={() => turnOffOn(selectedData)}>&rarr;</button>
      </div>
    </div>
    <ChangePIN selectedData={selectedData} />
  </div>
  );
}