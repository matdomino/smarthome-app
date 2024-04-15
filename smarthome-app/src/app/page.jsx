"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import AuthContext from './context/AuthProvider';

export default function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const LoggedInUser = cookie.get("LoggedInUser");

    if (LoggedInUser) {
      router.push('/home');
    } else if (auth.status && auth.user) {
      // NA KONIEC JAK BEDZIE HTTPS TO DODAC OPCJE SECURE DO CIASTECZKA - , secure: true
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      cookie.set("LoggedInUser", auth.user, {expires: expirationDate});
      setAuth({});
      router.push('/home');
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
    </>
  );
}
