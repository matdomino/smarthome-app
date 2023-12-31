import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';

const expressUrl = "http://158.101.175.186:3000/";

export default function SignIn ({ toggleForm }) {
  const { setAuth } = useContext(AuthContext);
  const [ loginResult, setLoginResult ] = useState(null);
  const [ success, setSuccess ] = useState(null);

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required('Hasło nie może być puste.')
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const res = await axios.get(`${expressUrl}user`, { username: values.username, password: values.password });
      
      if (res.data.status === 'success') {
        console.log('Udało sie polaczyc.');
      } else {
        alert('Niepoprawne dane logowania.')
      }
    } catch (err) {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.')
    }

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
        <h2>Zaloguj się</h2>
        <div>
          <label>
            Nazwa użytkownika:
          </label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Hasło:
          </label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Zaloguj się</button>
        <div>
          <a href="#" onClick={toggleForm}>Nie masz konta? Kliknij tutaj.</a>
        </div>
        <div className='errs'>
          <span>{errors.username}</span>
          <span>{errors.password}</span>
        </div>
      </form>
    </div>
  );
}
