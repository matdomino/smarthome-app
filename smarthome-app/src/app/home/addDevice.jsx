import { useContext } from "react";
import DevicesContext from '../context/DevicesProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AddDevice () {
  const { devices, setDevices } = useContext(DevicesContext);
  const { setAddDeviceMenu } = useContext(DevicesContext);

  const closeMenu = () => {
    setAddDeviceMenu(false);
  }

  const onSubmit = async (values, { resetForm }) => {
    resetForm();
  };

  const initialValues = {
    name: '',
    ipAdress: '',
    deviceType: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Nazwa urządzenia nie może być pusta.'),
    ipAdress: Yup.string().required('Adres IP nie może być pusty.'),
    deviceType: Yup.string().required('Wybierz rodzaj urządzenia.')
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, setFieldValue, errors } = formik;

  return(
    <>
      <form onSubmit={handleSubmit}>
        <h2>Dodaj urządzenie</h2>
        <div>
          <label>
            Nazwa urządzenia:
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Adres IP:
          </label>
          <input
            type="text"
            name="ipAdress"
            value={values.ipAdress}
            onChange={handleChange}
          />
        </div>
        <div>
            <label>
              <input
                type="radio"
                name="deviceType"
                value="SmartBulb"
                checked={values.deviceType === 'SmartBulb'}
                onChange={() => setFieldValue('deviceType', 'SmartBulb')}
              />
              Inteligenta żarówka
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="deviceType"
                value="SmartLock"
                checked={values.deviceType === 'SmartLock'}
                onChange={() => setFieldValue('deviceType', 'SmartLock')}
              />
              Inteligenta zamek
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="deviceType"
                value="SmartCurtains"
                checked={values.deviceType === 'SmartCurtains'}
                onChange={() => setFieldValue('deviceType', 'SmartCurtains')}
              />
              Rolety antywłamaniowe
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="deviceType"
                value="smartAC"
                checked={values.deviceType === 'smartAC'}
                onChange={() => setFieldValue('deviceType', 'smartAC')}
              />
              Klimatyzacja
            </label>
          </div>
          <div className='errs'>
          <span>{errors.name}</span>
          <span>{errors.ipAdress}</span>
          <span>{errors.deviceType}</span>
        </div>
          <div className="buttons">
            <button class="closeAddMenu" onClick={closeMenu}>Anuluj</button>
            <button type="submit">Dodaj urządzenie</button>
          </div>
      </form>
    </>
  );
}