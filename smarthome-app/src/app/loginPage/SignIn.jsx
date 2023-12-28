import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SignIn () {
  const [ loginResult, setLoginResult ] = useState(null);

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required('Hasło nie może być puste.')
  });

  const onSubmit = (values) => {
    // Dodac zapytanie do bazy danych
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
        <div className='errs'>
          <span>{errors.username}</span>
          <span>{errors.password}</span>
        </div>
      </form>
    </div>
  );
}
