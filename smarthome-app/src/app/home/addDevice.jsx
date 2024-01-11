import { useContext } from "react";
import { useRouter } from "next/navigation";
import DevicesContext from '../context/DevicesProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const ADDDEVICE = "/adddevice"

export default function AddDevice () {
  const { devices, setDevices } = useContext(DevicesContext);
  const { setMenu } = useContext(DevicesContext);
  const router = useRouter();

  const closeMenu = () => {
    setMenu(null);
  }

  const onSubmit = async (values, { resetForm }) => {
    const deviceData = {
      name: values.name,
      ipAdress: values.ipAdress,
      id: values.id,
      deviceType: values.deviceType
    }

    try {
      const res = await axios.post(ADDDEVICE, deviceData, { withCredentials: true });
      setDevices([
        ...devices,
        res.data.device
      ]);

      closeMenu();
    } catch(err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          router.push('/');
        }
        alert(err.response.data.error);
      } else {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      }
    }

    resetForm();
  };

  const initialValues = {
    name: '',
    ipAdress: '',
    id: '',
    deviceType: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Za krótka nazwa").max(20, "Za długa nazwa").required('Nazwa urządzenia nie może być pusta.'),
    ipAdress: Yup.string().required('Adres IP nie może być pusty.')
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,
        'Nieprawidłowy format adresu IP'
      ),
    id: Yup.string().min(5, 'ID za krótkie.').max(20, "ID za długie").required('ID nie może być puste.'),
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
            ID urządzenia:
          </label>
          <input
            type="text"
            name="id"
            value={values.id}
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
            <label className="radiolabel">
              <input
                type="radio"
                name="deviceType"
                value="SmartLock"
                checked={values.deviceType === 'SmartLock'}
                onChange={() => setFieldValue('deviceType', 'SmartLock')}
              />
              Inteligenty zamek
            </label>
          </div>
          <div>
            <label className="radiolabel">
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
            <label className="radiolabel">
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
          <div>
            <label className="radiolabel">
              <input
                type="radio"
                name="deviceType"
                value="thermometer"
                checked={values.deviceType === 'thermometer'}
                onChange={() => setFieldValue('deviceType', 'thermometer')}
              />
              Termometr
            </label>
          </div>
          <div className='errs'>
          <span>{errors.name}</span>
          <span>{errors.ipAdress}</span>
          <span>{errors.id}</span>
          <span>{errors.deviceType}</span>
        </div>
          <div className="buttons">
            <button className="closeMenu" onClick={closeMenu}>Anuluj</button>
            <button className="submit" type="submit">Dodaj urządzenie</button>
          </div>
      </form>
    </>
  );
}