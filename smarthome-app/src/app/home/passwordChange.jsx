import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const PASSWORD_CHANGE = "/passwordchange"

export default function PasswordChange() {
  const router = useRouter();

  const initialValues = {
    newPassword: '',
    passwordRep: '',
  }

  const validationSchema = Yup.object({
    newPassword: Yup.string().min(5, 'Za krótkie hasło').max(40, "Za długie hasło").required('Hasło nie może być puste.'),
    passwordRep: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Hasła się nie zgadzają')
  });

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      pass: values.newPassword
    }

    try {
      const res = await axios.put(PASSWORD_CHANGE, data, { withCredentials: true });

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
      <h2>Zmień hasło:</h2>
      <div>
        <label>
          Nowe hasło:
        </label>
        <input
          type="password"
          name="newPassword"
          value={values.newPassword}
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
      <div className="buttons">
        <button className="submit" type="submit">Wyślij</button>
      </div>
      <div className='errs'>
        <span>{errors.newPassword}</span>
        <span>{errors.passwordRep}</span>
      </div>
    </form>
  )
}