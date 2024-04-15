import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const client = mqtt.connect('ws://localhost:8000/mqtt');

const ChangeOpenPercentage = ({ selectedData }) => {
  const initialValues = {
    percentage: '',
  };

  const validationSchema = Yup.object({
    percentage: Yup.number().typeError("Stopień musi być liczbą.").integer("Stopień musi być liczbą całkowitą.").min(0, "Za mały stopień.").max(100, "Za wysoki stopień").required("Stopień nie może być pusty")
  });

  const onSubmit = async ( values, { resetForm }) => {
    client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: Ustaw stopień otwarcia na:", value: values.percentage}));

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
            Zmień stopień otwarcia:
          </label>
          <input
            type="text"
            name="percentage"
            value={values.percentage}
            onChange={handleChange}
          />
        </div>
        <div className='buttons'>
          <button className='submit' type="submit">Wyślij</button>
        </div>
        <div className='errs'>
          <span>{errors.percentage}</span>
        </div>
      </form>
    </div>
  );
};

const ChangeOpenAngle = ({ selectedData }) => {
  const initialValues = {
    angle: '',
  };

  const validationSchema = Yup.object({
    angle: Yup.number().typeError("Kąt musi być liczbą.").integer("Kąt musi być liczbą całkowitą.").min(0, "Za niski kąt.").max(90, "Za wysoki kąt").required("Kąt nie może być pusty.")
  });

  const onSubmit = async ( values, { resetForm }) => {
    client.publish(`${selectedData.device.device.id}`, JSON.stringify({msg: "R: Ustaw kąt otwarcia na:", value: values.angle}));

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
            Zmień kąt otwarcia:
          </label>
          <input
            type="text"
            name="angle"
            value={values.angle}
            onChange={handleChange}
          />
        </div>
        <div className='buttons'>
          <button className='submit' type="submit">Wyślij</button>
        </div>
        <div className='errs'>
          <span>{errors.angle}</span>
        </div>
      </form>
    </div>
  );
};

export default function SmartCurtainsSettings() {
  const { selectedData } = useContext(DevicesContext);
  return(
  <div>
    <ChangeOpenPercentage selectedData={selectedData} />
    <ChangeOpenAngle selectedData={selectedData} />
  </div>
  );
}