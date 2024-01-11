import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const USERNAME_CHANGE = "/usernamechange"

export default function UsernameChange() {
  const router = useRouter();

  const initialValues = {
    newUsername: '',
    password: '',
  }

  const validationSchema = Yup.object({
    newUsername: Yup.string().min(5, "Za krótka nazwa użytkownika").max(20, "Za długa nazwa użytkownika").required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required("Podaj hasło.")
  });

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      user: values.newUsername,
      pass: values.password
    };
    
    try {
      const res = await axios.put(USERNAME_CHANGE, data, { withCredentials: true });

      if (res.data.status === 'success') {
        router.push("/");
      }
    } catch (err) {
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <form onSubmit={handleSubmit}>
      <h2>Zmień nazwę konta:</h2>
      <div>
        <label>
          Nowa nazwa użytkownika:
        </label>
        <input
              type="text"
              name="newUsername"
              value={values.newUsername}
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
      <div className="buttons">
        <button className="submit" type="submit">Wyślij</button>
      </div>
      <div className='errs'>
            <span>{errors.newUsername}</span>
            <span>{errors.password}</span>
          </div>
    </form>
  )
}