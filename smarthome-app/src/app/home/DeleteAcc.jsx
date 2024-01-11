import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const DELETE_ACC = "/deleteacc";

export default function DeleteAcc() {
  const router = useRouter();

  const initialValues = {
    password: '',
  }

  const validationSchema = Yup.object({
    password: Yup.string().required('Hasło nie może być puste.'),
  });

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      pass: values.password
    }

    try {
      const res = await axios.delete(DELETE_ACC, { data: data, withCredentials: true });

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
      <h2>Usuń konto:</h2>
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
        <button className="deleteAcc" type="submit">Wyślij</button>
      </div>
      <div className='errs'>
        <span>{errors.password}</span>
      </div>
    </form>
  );
}