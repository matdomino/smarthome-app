import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SignUp ({ toggleForm }) {
    const [ loginResult, setLoginResult ] = useState(null);
  
    const initialValues = {
      email: '',
      username: '',
      password: '',
      passwordRep: ''
    };
  
    const validationSchema = Yup.object({
      email: Yup.string().email('Niepoprawny adres email').required('Email nie może być pusty'),
      username: Yup.string().required('Nazwa użytkownika nie może być pusta.'),
      password: Yup.string().min(5, 'Za krótkie hasło').required('Hasło nie może być puste.'),
      passwordRep: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła się nie zgadzają')
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
          <h2>Zarejestruj się</h2>
          <div>
            <label>
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
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
          <div>
            <label>
              Powtórz hasło:
            </label>
            <input
              type="password"
              name="passwordRep"
              value={values.passwordRep}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Zarejestruj się</button>
          <div>
            <a href="#" onClick={toggleForm}>Masz już konto? Kliknij tutaj.</a>
          </div>
          <div className='errs'>
            <span>{errors.email}</span>
            <span>{errors.username}</span>
            <span>{errors.password}</span>
            <span>{errors.passwordRep}</span>
          </div>
        </form>
      </div>
    );
  }
  