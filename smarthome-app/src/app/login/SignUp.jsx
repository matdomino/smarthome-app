import { useContext } from 'react';
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthProvider';
import axios from '@/api/axios';

const CREATEACC_URL = "/createacc";

export default function SignUp ({ toggleForm }) {
    const { setAuth } = useContext(AuthContext);
    const router = useRouter();
  
    const initialValues = {
      email: '',
      username: '',
      password: '',
      passwordRep: ''
    };
  
    const validationSchema = Yup.object({
      email: Yup.string().email('Niepoprawny adres email').max(35, 'Za długi email').required('Email nie może być pusty'),
      username: Yup.string().min(5, "Za krótka nazwa użytkownika").max(20, "Za długa nazwa użytkownika").required('Nazwa użytkownika nie może być pusta.'),
      password: Yup.string().min(5, 'Za krótkie hasło').max(40, "Za długie hasło").required('Hasło nie może być puste.'),
      passwordRep: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła się nie zgadzają')
    });
  
    const onSubmit = async (values, { resetForm }) => {
      const userData = {
        email: values.email,
        user: values.username,
        pass: values.password
      };

      try {
        const res = await axios.post(CREATEACC_URL, userData);

        if (res.data.status === 'success') {
          const accessToken = res.data.key;
          setAuth({ user: values.username, password: values.password, token: accessToken });
          router.push("/home");
        }
      } catch(err) {
        if (err.response && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
        }
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
  