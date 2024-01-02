"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import AuthContext from './context/AuthProvider';

export default function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = cookie.get("isLoggedIn");

    if (isLoggedIn) {
      router.push('/home');
    } else if (auth.token && auth.user) {
      setAuth({});
      // NA KONIEC JAK BEDZIE HTTPS TO DODAC OPCJE SECURE DO CIASTECZKA - , secure: true
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      cookie.set("isLoggedIn", "true", {expires: expirationDate});
      cookie.set("accessToken", auth.token, {expires: expirationDate, httpOnly: true});
      cookie.set("username", auth.user, {expires: expirationDate, httpOnly: true});
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
    </>
  );
}
