"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from './context/AuthProvider';

export default function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const isLoggedIn = true;
  const router = useRouter();

  if (true) { // Dodac oblusge ciasteczka do sesji logowania
    router.push("/login");
  } else {
    router.push("/home");
  }

  return (
    <>
    </>
  );
}
