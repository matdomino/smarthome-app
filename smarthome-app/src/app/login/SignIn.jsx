import { useState, useContext } from 'react';
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthProvider';
import axios from '@/api/axios';

const AUTH_URL = "/auth";

export default function SignIn ({ toggleForm }) {
  const { setAuth } = useContext(AuthContext);
  const [ loginResult, setLoginResult ] = useState(null);
  const [ success, setSuccess ] = useState(null);
  const router = useRouter();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required('Hasło nie może być puste.')
  });

  const onSubmit = async (values, { resetForm }) => {
    const userData = {
      user: values.username,
      pass: values.password
    };

    try {
      const res = await axios.post(AUTH_URL, userData);
      
      if (res.data.status === 'success') {
        const accessToken = res.data.key;
        setAuth({ user: values.username, password: values.password, token: accessToken });
        router.push("/home");
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
